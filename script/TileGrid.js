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
        const self = this;
        const matchedTiles = [];
        
        self.forEachTile((tile, x, y) => {

            const targetTileType = tile.tileType;
            const matchedXTiles = [];
            const matchedYTiles = [];

            // Check for matches to the right
            let currX = (x + 1);
            while(currX < self.tileWidth)
            {
                if(targetTileType === self.tileGrid[y][currX].tileType)
                {
                    matchedXTiles.push(self.tileGrid[y][currX]);
                }
                else
                {
                    break;
                }

                currX++;
            }

            // Check for matches to the left
            currX = (x - 1);
            while(currX > 0)
            {
                if(targetTileType === self.tileGrid[y][currX].tileType)
                {
                    matchedXTiles.push(self.tileGrid[y][currX]);
                }
                else
                {
                    break;
                }

                currX--;
            }

            // Check matches downwards
            let currY = (y + 1);
            while(currY < self.tileHeight)
            {
                if(targetTileType === self.tileGrid[currY][x].tileType)
                {
                    matchedYTiles.push(self.tileGrid[currY][x]);
                }
                else
                {
                    break;
                }

                currY++;
            }

            // Check matches upwards
            currY = (y - 1);
            while(currY > 0)
            {
                if(targetTileType === self.tileGrid[currY][x].tileType)
                {
                    matchedYTiles.push(self.tileGrid[currY][x]);
                }
                else
                {
                    break;
                }

                currY--;
            }
            
            if(matchedYTiles.length > 1)
            {
                matchedTiles.push(...matchedYTiles);
            }
            
            if(matchedXTiles.length > 1)
            {
                matchedTiles.push(...matchedXTiles);
            }

            if(matchedYTiles.length > 1 || matchedXTiles.length > 1)
            {
                matchedTiles.push(tile);
            }
        });

        return matchedTiles;
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