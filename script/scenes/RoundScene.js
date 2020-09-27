import ActionScriptManifest from '../ActionScriptManifest';
import ActionQueue from '../ActionQueue';
import Director from '../Director';
import FontStyleManifest from '../FontStyleManifest';
import Guide from '../Guide';
import LevelManifest from '../LevelManifest';
import ScoreDisplay from '../ScoreDisplay';
import TileGrid from '../TileGrid';
import Timer from '../Timer';
import WebFontLoader from 'webfontloader';
import EventEmitter from '../EventEmitter';

export default class extends Phaser.Scene {

    constructor()
    {
        super('RoundScene');

        this.isAwaitingRoundTransition = false;
        this.isReadyForRoundTransition = false;
        this.isTransitioningRounds = false;
        this.isBlockingMatches = false;

        this.score = null;
        this.queue = null;
        this.selectedTiles = null;
        this.tileGrid = null;
        this.scoreDisplay = null;
        this.timer = null;

        this.levelClearMessage = null;
        this.levelClearMessageHighlight = null;
 
        this.director = null;
        this.guide = null;
        this.level = null;

        this.emitter = null;

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
        this.load.image('tile_01', 'assets/images/tile_01.png');
        this.load.image('tile_02', 'assets/images/tile_02.png');
        this.load.image('tile_03', 'assets/images/tile_03.png');
        this.load.image('tile_04', 'assets/images/tile_04.png');

        // Images: Guide
        this.load.image('guide_character', 'assets/images/guide.png');

        // Images: Background
        this.load.image('background', 'assets/images/background.png');

        // Images: Round Clear
        this.load.image('round_clear', 'assets/images/round_clear.png');

        // Images: Icons
        this.load.image('icon_tile', 'assets/images/icon_tile.png');
        this.load.image('icon_timer', 'assets/images/icon_timer.png');

        // Images: Expressions
        this.load.image('expression_default', 'assets/images/expression_default.png');
        this.load.image('expression_surprise', 'assets/images/expression_surprise.png');
        this.load.image('expression_sadness', 'assets/images/expression_sadness.png');
        this.load.image('expression_despair', 'assets/images/expression_despair.png');
        this.load.image('expression_glee', 'assets/images/expression_glee.png');
        this.load.image('expression_nervous', 'assets/images/expression_nervous.png');
        this.load.image('expression_confused', 'assets/images/expression_confused.png');
        this.load.image('expression_neutral', 'assets/images/expression_neutral.png');
        this.load.image('expression_amused', 'assets/images/expression_amused.png');
        this.load.image('expression_thoughtful', 'assets/images/expression_thoughtful.png');

        // Sound Effects
        this.load.audio('match', 'assets/sounds/match.wav');
        this.load.audio('swap', 'assets/sounds/swap.wav');
    }

    init(data)
    {
        this.level = data.level || 0;
    }

    create()
    {
        this.isTransitioningRounds = false;
        this.isRoundTransitionComplete = false;
        this.isBlockingMatches = LevelManifest[this.level].blockMatching;

        this.score = 0;
        this.totalMatches = 0;

        this.queue = new ActionQueue();

        this.add.image(400, 330, 'background');

        const tileGenerationBehavior = LevelManifest[this.level].behavior;

        this.selectedTiles = [];
        this.tileGrid = new TileGrid(6, 6, 80, 325, -265, this.onTileSelect, this.onTileMatch, tileGenerationBehavior, this.queue);
        this.scoreDisplay = new ScoreDisplay(110, 585);

        const timerSeconds = LevelManifest[this.level].timer;
        this.timer = (timerSeconds > 0) ? new Timer(110, 625, timerSeconds) : null;

        this.guide = new Guide(20, 20, (this.level === 0));

        this.tileGrid.create(this);
        this.scoreDisplay.create(this);
        this.timer && this.timer.create(this);
        this.guide.create(this);
        this.emitter = new EventEmitter();

        this.levelClearMessage = this.add.image(400, 400, 'round_clear');
        this.levelClearMessage.setAlpha(0);
        this.levelClearMessage.setDepth(1);

        this.levelClearMessageHighlight = this.add.image(400, 400, 'round_clear');
        this.levelClearMessageHighlight.setAlpha(0);
        this.levelClearMessageHighlight.setDepth(1);
        this.levelClearMessageHighlight.setTintFill(0xffffff);

        const actionScript = ActionScriptManifest.getScript(this.level);
        this.director = new Director(actionScript, this.guide, this.timer, this.tileGrid, this, this);

        const self = this;
        this.input.on('pointerdown', () => { self.director.next(self); });
    }

    update()
    {
        if(this.isTransitioningRounds)
        {
            return;
        }

        if(this.isRoundTransitionComplete)
        {
            this.nextLevel();
            return;
        }

        // Have we run out of time?
        if(this.timer != null && this.timer.ticks <= 0)
        {
            this.isTransitioningRounds = true;
            this.emitter.emit('gameOver');
            return;
        }

        if(this.isLevelHalfwayComplete())
        {
            this.emitter.emit('halfComplete');
        }

        if(this.isLevelComplete())
        {
            this.endLevel();
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
                context.emitter.emit('swap');
    
                context.queue.push(() => {
    
                    // If there are no matches (or we're in a round where matches are blocked), swap the tiles back
                    if(
                        context.isBlockingMatches ||
                        (!context.tileGrid.hasMatches(firstSelectedTile.tileGridX, firstSelectedTile.tileGridY) &&
                        !context.tileGrid.hasMatches(secondSelectedTile.tileGridX, secondSelectedTile.tileGridY))
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

    isLevelHalfwayComplete()
    {
        return this.score >= (LevelManifest[this.level].score/2);
    }

    isLevelComplete()
    {
        return this.score >= LevelManifest[this.level].score;
    }

    endLevel()
    {
        const self = this;

        self.isTransitioningRounds = true;
        self.tileGrid.block(this);

        self.levelClearMessageHighlight.setAlpha(1);
        self.tweens.add({
            targets: self.levelClearMessageHighlight,
            alpha: 0,
            duration: 1000
        });

        self.tweens.add({
            targets: self.levelClearMessage,
            alpha: 1,
            duration: 1000,
            completeDelay: 2000,
            onComplete: () => {
                self.isRoundTransitionComplete = true;
                self.isTransitioningRounds = false; 
            }
        });
    }

    nextLevel()
    {
        this.scene.restart({ level: (this.level + 1) });
    }
    
}