import { getRandomItem } from './Utility';
import Tile from './Tile';
import TileType from './TileType';

export default class {

    constructor(tileWidth, tileHeight, offsetX, offsetY, onTileSelect)
    {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.tileHeight = tileHeight;
        this.tileWidth = tileWidth;
        this.tileGrid = [];
        this.onTileSelect = onTileSelect;

        for(let y = 0; y < tileHeight; y++)
        {
            this.tileGrid[y] = [];
            for(let x = 0; x < tileWidth; x++)
            {
                this.tileGrid[y][x] = new Tile(getRandomItem(TileType), this.offsetX + (50 * x), this.offsetY + (50 * y), x, y, this.onTileSelect);
            }
        }
    }

    create(context)
    {
        this.forEachTile(tile => tile.create(context));
    }

    swapTiles(firstTile, secondTile)
    {
        let firstTileX = firstTile.x;
        let firstTileY = firstTile.y;
        let firstTileGridX = firstTile.tileGridX;
        let firstTileGridY = firstTile.tileGridY;

        let secondTileX = secondTile.x;
        let secondTileY = secondTile.y;
        let secondTileGridX = secondTile.tileGridX;
        let secondTileGridY = secondTile.tileGridY;

        secondTile.updatePosition(firstTileX, firstTileY, firstTileGridX, firstTileGridY);
        this.tileGrid[firstTileGridY][firstTileGridX] = secondTile;

        firstTile.updatePosition(secondTileX, secondTileY, secondTileGridX, secondTileGridY);
        this.tileGrid[secondTileGridY][secondTileGridX] = firstTile;
    }

    getMatches()
    {
        let matches = [];

        this.forEachTile((tile, x, y) => {

            

        });
    }

    forEachTile(callback)
    {
        for(let y = 0; y < this.tileHeight; y++)
        {
            for(let x = 0; x < this.tileWidth; x++)
            {
                callback(this.tileGrid[y][x], x, y);
            }
        }
    }
}