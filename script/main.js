import ActionQueue from './ActionQueue';
import ScoreDisplay from './ScoreDisplay';
import TileGrid from './TileGrid';
import Timer from './Timer';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 1200, // 600
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let score = 0;

const game = new Phaser.Game(config);
const queue = new ActionQueue();

let selectedTiles = [];
const tileGrid = new TileGrid(10, 10, 50, 50, 50, onTileSelect, onTileMatch, queue);
const scoreDisplay = new ScoreDisplay(5, 5);
const timer = new Timer(500, 5, 90);

function preload()
{
    this.load.image('tile_01', 'assets/tile_01.png');
    this.load.image('tile_02', 'assets/tile_02.png');
    this.load.image('tile_03', 'assets/tile_03.png');
    this.load.image('tile_04', 'assets/tile_04.png');
}

function create()
{
    tileGrid.create(this);
    scoreDisplay.create(this);
    timer.create(this);
}

function update()
{
    // Are we currently executing a queued action?
    if(queue.isActionRunning())
    {
        return;
    }

    // Do we have any queued actions on the stack?
    if(queue.hasActions())
    {
        queue.next();
        return;
    }

    // If nothing's left in the queue, we can move the game's state forward
    tileGrid.update(this);
}

function onTileSelect(context, tile) {

    // Are we currently executing a queued action?
    if(queue.isActionRunning())
    {
        return;
    }

    // Can we select this tile?
    if(!tileGrid.canSelect(tile))
    {
        return;
    }

    if(selectedTiles.length === 0)
    {
        selectedTiles.push(tile);
        tile.activate();
        return;
    }

    if(selectedTiles.length === 1)
    {
        const selectedTile = selectedTiles[0];
        const xDiff = Math.abs(selectedTile.tileGridX - tile.tileGridX);
        const yDiff = Math.abs(selectedTile.tileGridY - tile.tileGridY);

        if((xDiff === 1 && yDiff === 0) || (xDiff === 0 && yDiff === 1))
        {
            selectedTiles.push(tile);

            let firstSelectedTile = selectedTiles[0];
            let secondSelectedTile = selectedTiles[1];

            tileGrid.swapTiles(context, firstSelectedTile, secondSelectedTile);

            queue.push(() => {

                // If there are no matches, swap the tiles back
                if(
                    !tileGrid.hasMatches(firstSelectedTile.tileGridX, firstSelectedTile.tileGridY) &&
                    !tileGrid.hasMatches(secondSelectedTile.tileGridX, secondSelectedTile.tileGridY)
                )
                {
                    tileGrid.swapTiles(context, firstSelectedTile, secondSelectedTile);
                }

                return Promise.resolve();

            });

            selectedTiles.forEach((tile) => { tile.deactivate(); });
            selectedTiles = [];
        }
    }

}

function onTileMatch(matchedTiles)
{
    score += 10;
    scoreDisplay.updateScore(score);
}