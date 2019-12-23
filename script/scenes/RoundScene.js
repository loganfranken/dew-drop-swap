import ActionQueue from '../ActionQueue';
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
        this.comboCount = null;
    }

    preload()
    {
        this.load.image('tile_01', 'assets/tile_01.png');
        this.load.image('tile_02', 'assets/tile_02.png');
        this.load.image('tile_03', 'assets/tile_03.png');
        this.load.image('tile_04', 'assets/tile_04.png');
    }

    create()
    {
        this.score = 0;
        this.comboCount = 0;

        this.queue = new ActionQueue();

        this.selectedTiles = [];
        this.tileGrid = new TileGrid(6, 6, 50, 50, 50, this.onTileSelect, this.onTileMatch, this.queue);
        this.scoreDisplay = new ScoreDisplay(5, 5);
        this.timer = new Timer(500, 5, 30);

        this.tileGrid.create(this);
        this.scoreDisplay.create(this);
        this.timer.create(this);
    }

    update()
    {
        // Have we run out of time?
        if(this.timer.seconds <= 0)
        {
            this.scene.start('GameOverScene', { score: this.score });
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

        context.score += (10 * context.comboCount);
        context.scoreDisplay.updateScore(context.score);
    }
    
}