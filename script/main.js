import TileGrid from './TileGrid';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
const tileGrid = new TileGrid(10, 10, 50, 50, onTileSelect);

let selectedTiles = [];

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
}

function update()
{
}

function onTileSelect(tile) {

    selectedTiles.push(tile);

    if(selectedTiles.length === 2)
    {
        tileGrid.swapTiles(...selectedTiles);
        selectedTiles.forEach((tile) => { tile.deactivate(); });
        selectedTiles = [];

        const matchedTiles = tileGrid.getMatches();
        matchedTiles.forEach(t => t.activate());
    }

}