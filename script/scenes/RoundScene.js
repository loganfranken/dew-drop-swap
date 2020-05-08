import ActionQueue from '../ActionQueue';
import DialogManager from '../DialogManager';
import Guide from '../Guide';
import ScoreDisplay from '../ScoreDisplay';
import TileGrid from '../TileGrid';
import Timer from '../Timer';

export default class extends Phaser.Scene {

    constructor()
    {
        super('RoundScene');

        this.score = null;
        this.queue = null;
        this.selectedTiles = null;
        this.tileGrid = null;
        this.scoreDisplay = null;
        this.timer = null;
 
        this.guide = null;
        this.level = null;

        this.comboCount = null;
        this.totalMatches = null;
    }

    preload()
    {
        // Images: Tiles
        this.load.image('tile_01', 'assets/tile_01.png');
        this.load.image('tile_02', 'assets/tile_02.png');
        this.load.image('tile_03', 'assets/tile_03.png');
        this.load.image('tile_04', 'assets/tile_04.png');

        // Images: Guide
        this.load.image('guide_character', 'assets/guide.png');

        // Images: Background
        this.load.image('background', 'assets/background.png');
    }

    init(data)
    {
        this.level = data.level;
    }

    create()
    {
        this.score = 0;
        this.comboCount = 0;
        this.totalMatches = 0;

        this.queue = new ActionQueue();

        this.add.image(400, 400, 'background');

        this.selectedTiles = [];
        this.tileGrid = new TileGrid(6, 6, 80, 325, -285, this.onTileSelect, this.onTileMatch, this.queue);
        this.scoreDisplay = new ScoreDisplay(5, 520);
        this.timer = (this.level > 0) ? new Timer(5, 570, 120) : null;

        const dialogManager = new DialogManager();
        const script = dialogManager.getScript(this.level);
        this.guide = new Guide(20, 20, script);

        this.tileGrid.create(this);
        this.scoreDisplay.create(this);
        this.timer && this.timer.create(this);
        this.guide.create(this);

        const self = this;
        this.input.on('pointerdown', () => { self.guide.progressDialogue(); });
    }

    update()
    {
        // Have we run out of time?
        if(this.timer != null && this.timer.seconds <= 0)
        {
            this.scene.start('GameOverScene', { score: this.score });
            return;
        }

        if(this.isLevelComplete())
        {
            this.scene.start('RoundTransitionScene', { nextLevel: (this.level + 1) });
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
                
                context.comboCount = 0;
            }
        }
    }

    onTileMatch(context, matchedTiles)
    {
        context.comboCount++;
        context.totalMatches++;

        context.score += (matchedTiles.length * context.comboCount);
        context.scoreDisplay.updateScore(context.score);

        context.guide.displayTileMatchMessage(context, {
            comboCount: context.comboCount,
            totalMatches: context.totalMatches
        });

        if(context.comboCount > 1)
        {
            context.scoreDisplay.updateCombo(`${context.comboCount}x multiplier!`);
        }
        else
        {
            context.scoreDisplay.updateCombo('');
        }
    }

    isLevelComplete()
    {
        if(this.level === 0 && this.score >= 100)
        {
            return true;
        }

        if(this.level === 1 && this.score >= 200)
        {
            return true;
        }

        return false;
    }
    
}