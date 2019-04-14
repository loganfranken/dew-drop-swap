import { getRandomItem } from './Utility';
import Tile from './Tile';
import TileType from './TileType';

export default class {

    constructor(tileWidth, tileHeight, offsetX, offsetY)
    {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.tileHeight = tileHeight;
        this.tileWidth = tileWidth;
        this.tileGrid = [];

        for(let y = 0; y < tileHeight; y++)
        {
            this.tileGrid[y] = [];
            for(let x = 0; x < tileWidth; x++)
            {
                this.tileGrid[y][x] = new Tile(getRandomItem(TileType), this.offsetX + (50 * x), this.offsetY + (50 * y), this.onTileSelect);
            }
        }
    }

    create(context)
    {
        for(let y = 0; y < this.tileHeight; y++)
        {
            for(let x = 0; x < this.tileWidth; x++)
            {
                this.tileGrid[y][x].create(context);            
            }
        }
    }

    onTileSelect(tile)
    {
        tile.activate();
    }
}