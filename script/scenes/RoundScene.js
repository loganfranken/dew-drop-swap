import ActionQueue from '../ActionQueue';
import DialogManager from '../DialogManager';
import FontStyleManifest from '../FontStyleManifest';
import Guide from '../Guide';
import LevelManifest from '../LevelManifest';
import ScoreDisplay from '../ScoreDisplay';
import TileGrid from '../TileGrid';
import Timer from '../Timer';
import WebFontLoader from 'webfontloader';

export default class extends Phaser.Scene {

    constructor()
    {
        super('RoundScene');

        this.isAwaitingRoundTransition = false;
        this.isReadyForRoundTransition = false;
        this.isTransitioningRounds = false;

        this.score = null;
        this.queue = null;
        this.selectedTiles = null;
        this.tileGrid = null;
        this.scoreDisplay = null;
        this.timer = null;

        this.levelClearMessage = null;
        this.levelClearMessageHighlight = null;
 
        this.guide = null;
        this.level = null;

        this.totalMatches = null;
    }

    preload()
    {
        WebFontLoader.load({
            google: {
                families: [FontStyleManifest.Default.googleFontName]
            }
        });

        // Images: Tiles
        this.load.image('tile_01', 'assets/tile_01.png');
        this.load.image('tile_02', 'assets/tile_02.png');
        this.load.image('tile_03', 'assets/tile_03.png');
        this.load.image('tile_04', 'assets/tile_04.png');

        // Images: Guide
        this.load.image('guide_character', 'assets/guide.png');

        // Images: Background
        this.load.image('background', 'assets/background.png');

        // Images: Round Clear
        this.load.image('round_clear', 'assets/round_clear.png');

        // Images: Icons
        this.load.image('icon_tile', 'assets/icon_tile.png');
        this.load.image('icon_timer', 'assets/icon_timer.png');
    }

    init(data)
    {
        this.level = data.level || 0;
    }

    create()
    {
        this.isAwaitingRoundTransition = false;
        this.isReadyForRoundTransition = false;
        this.isTransitioningRounds = false;

        this.score = 0;
        this.totalMatches = 0;

        this.queue = new ActionQueue();

        this.add.image(400, 400, 'background');

        const tileGenerationBehavior = LevelManifest[this.level].behavior;

        this.selectedTiles = [];
        this.tileGrid = new TileGrid(6, 6, 80, 325, -265, this.onTileSelect, this.onTileMatch, tileGenerationBehavior, this.queue);
        this.scoreDisplay = new ScoreDisplay(110, 585);

        const timerSeconds = LevelManifest[this.level].timer;
        this.timer = (timerSeconds > 0) ? new Timer(110, 625, timerSeconds) : null;

        const dialogManager = new DialogManager();
        const script = dialogManager.getScript(this.level);
        this.guide = new Guide(20, 20, script);

        this.tileGrid.create(this);
        this.scoreDisplay.create(this);
        this.timer && this.timer.create(this);
        this.guide.create(this);

        this.levelClearMessage = this.add.image(400, 400, 'round_clear');
        this.levelClearMessage.setAlpha(0);

        this.levelClearMessageHighlight = this.add.image(400, 400, 'round_clear');
        this.levelClearMessageHighlight.setAlpha(0);
        this.levelClearMessageHighlight.setTintFill(0xffffff);

        const self = this;
        this.input.on('pointerdown', () => { self.guide.progressDialogue(); });
    }

    update()
    {
        // If gameplay is currently blocked, make sure the tile grid reflects that
        if(this.guide.isBlockingGameplay && !this.tileGrid.isBlocked)
        {
            this.tileGrid.block(this);
        }
        else if(!this.guide.isBlockingGameplay && this.tileGrid.isBlocked)
        {
            this.tileGrid.unblock(this);
        }

        if(this.isAwaitingRoundTransition)
        {
            if(this.isReadyForRoundTransition && !this.isTransitioningRounds)
            {
                this.nextLevel();
            }

            return;
        }

        this.handleSpecialLevelBehavior();
        
        // Start the timer if the guide has stopped talking
        if(!this.guide.isBlockingGameplay && this.timer && this.timer.isPaused)
        {
            this.timer.start();
        }

        // Have we run out of time?
        if(this.timer != null && this.timer.seconds <= 0)
        {
            this.guide.displayGameOverMessage();
            this.isAwaitingRoundTransition = true;
            return;
        }

        if(this.isLevelComplete())
        {
            this.endLevel();
            this.isAwaitingRoundTransition = true;
            return;
        }

        // Are we currently executing a queued action?
        if(this.queue.isActionRunning())
        {
            return;
        }

        // Do we have any queued actions on the stack?
        if(this.queue.hasActions())
        {
            this.queue.next();
            return;
        }

        // If nothing's left in the queue, we can move the game's state forward
        this.tileGrid.update(this);
    }

    onTileSelect(context, tile)
    {
        // Are we currently executing a queued action?
        if(context.queue.isActionRunning())
        {
            return;
        }

        // Is the guide currently blocking gameplay?
        if(context.guide.isBlockingGameplay)
        {
            return;
        }
    
        // Can we select this tile?
        if(!context.tileGrid.canSelect(tile))
        {
            return;
        }

        // Is this tile already selected?
        if(tile.isActivated)
        {
            context.selectedTiles = [];
            tile.deactivate();
            return;
        }
    
        if(context.selectedTiles.length === 0)
        {
            context.selectedTiles.push(tile);
            tile.activate();
            return;
        }
    
        if(context.selectedTiles.length === 1)
        {
            const selectedTile = context.selectedTiles[0];
            const xDiff = Math.abs(selectedTile.tileGridX - tile.tileGridX);
            const yDiff = Math.abs(selectedTile.tileGridY - tile.tileGridY);
    
            if((xDiff === 1 && yDiff === 0) || (xDiff === 0 && yDiff === 1))
            {
                context.selectedTiles.push(tile);
    
                let firstSelectedTile = context.selectedTiles[0];
                let secondSelectedTile = context.selectedTiles[1];
    
                context.tileGrid.swapTiles(context, firstSelectedTile, secondSelectedTile);
    
                context.queue.push(() => {
    
                    // If there are no matches, swap the tiles back
                    if(
                        !context.tileGrid.hasMatches(firstSelectedTile.tileGridX, firstSelectedTile.tileGridY) &&
                        !context.tileGrid.hasMatches(secondSelectedTile.tileGridX, secondSelectedTile.tileGridY)
                    )
                    {
                        context.tileGrid.swapTiles(context, firstSelectedTile, secondSelectedTile);
                    }
    
                    return Promise.resolve();
    
                });
    
                context.selectedTiles.forEach((tile) => { tile.deactivate(); });
                context.selectedTiles = [];
            }
        }
    }

    onTileMatch(context, matchedTiles)
    {
        context.totalMatches++;

        context.score += matchedTiles.length;
        context.scoreDisplay.updateScore(context.score);
    }

    isLevelComplete()
    {
        return this.score >= LevelManifest[this.level].score;
    }

    handleSpecialLevelBehavior()
    {
        const handler = LevelManifest[this.level].handler;
        handler && handler({
            tileGrid: this.tileGrid,
            score: this.score,
            level: this.level
        });
    }

    endLevel()
    {
        const self = this;

        self.isTransitioningRounds = true;

        this.levelClearMessageHighlight.setAlpha(1);
        self.tweens.add({
            targets: this.levelClearMessageHighlight,
            alpha: 0,
            duration: 1000
        });

        self.tweens.add({
            targets: this.levelClearMessage,
            alpha: 1,
            duration: 1000,
            completeDelay: 2000,
            onComplete: () => {
                self.isReadyForRoundTransition = true;
                self.isTransitioningRounds = false; 
            }
        });
    }

    nextLevel()
    {
        this.scene.restart({ level: (this.level + 1) });
    }
    
}