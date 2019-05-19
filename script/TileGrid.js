import { getRandomItem } from './Utility';
import Tile from './Tile';
import TileType from './TileType';
import TileState from './TileState';

export default class {

    constructor(tileWidth, tileHeight, offsetX, offsetY, onTileSelect, queue)
    {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.tileHeight = tileHeight;
        this.tileWidth = tileWidth;
        this.tileGrid = [];
        this.onTileSelect = onTileSelect;
        this.queue = queue;

        for(let y = 0; y < tileHeight; y++)
        {
            this.tileGrid[y] = [];
            for(let x = 0; x < tileWidth; x++)
            {
                const aboveTile = (y < 1) ? null : this.tileGrid[y - 1][x];
                const leftTile = (x < 1) ? null : this.tileGrid[y][x - 1];

                const tileType = getRandomItem(TileType.filter(t =>
                    (aboveTile === null || t.name !== aboveTile.tileType.name) &&
                    (leftTile === null || t.name !== leftTile.tileType.name)
                ));

                this.tileGrid[y][x] = new Tile(tileType, this.offsetX + (50 * x), this.offsetY + (50 * y), x, y, this.onTileSelect);
            }
        }
    }

    create(context)
    {
        this.forEachTile(tile => tile.create(context));
    }

    update(context)
    {
        const self = this;

        // Detect and destroy any matches
        const matchedTiles = self.getMatches();

        let destroys = [];
        matchedTiles.forEach(t => { destroys.push(t.destroy(context)); });

        if(destroys.length > 0)
        {
            self.queue.push(() => { return Promise.all(destroys); });
        }

        // Remove any destroyed tiles
        self.forEachTile((tile, x, y) => {

            if(self.tileGrid[y][x].state === TileState.Destroyed)
            {
                self.tileGrid[y][x] = null;
            }

        });

        // Identify any tiles that need to drop
        let dropTiles = [];

        self.forEachTile((tile, x, y) => {

            if(y < (self.tileHeight - 1))
            {
                // Is the tile below an empty spot?
                const belowTile = self.tileGrid[y + 1][x];
                if(belowTile === null && self.tileGrid[y][x] != null)
                {
                    dropTiles.push({ tile, x, y });
                }
            }

        });

        let drops = [];

        // Now that we've identified all the tiles that need to drop,
        // let's queue all of the tiles in those columns to drop
        dropTiles.forEach(({tile, x, y}) => {

            let currY = y;
            while(currY >= 0)
            {
                let currTile = self.tileGrid[currY][x];
            
                if(currTile != null)
                {
                    self.tileGrid[currY + 1][x] = currTile;
                    drops.push(currTile.updatePosition(context, self.offsetX + (50 * x), self.offsetY + (50 * (currY + 1)), x, currY + 1));
                }

                currY--;
            }

        });

        if(drops.length > 0)
        {
            self.queue.push(() => { return Promise.all(drops); });
        }
    }

    swapTiles(context, firstTile, secondTile)
    {
        let self = this;

        self.queue.push(() => {
            
            let firstTileX = firstTile.x;
            let firstTileY = firstTile.y;
            let firstTileGridX = firstTile.tileGridX;
            let firstTileGridY = firstTile.tileGridY;
    
            let secondTileX = secondTile.x;
            let secondTileY = secondTile.y;
            let secondTileGridX = secondTile.tileGridX;
            let secondTileGridY = secondTile.tileGridY;
    
            let firstSwap = secondTile.updatePosition(context, firstTileX, firstTileY, firstTileGridX, firstTileGridY);
            self.tileGrid[firstTileGridY][firstTileGridX] = secondTile;
    
            let secondSwap = firstTile.updatePosition(context, secondTileX, secondTileY, secondTileGridX, secondTileGridY);
            self.tileGrid[secondTileGridY][secondTileGridX] = firstTile;

            return Promise.all([firstSwap, secondSwap]);

        });
    }

    hasMatches(targetGridX, targetGridY)
    {
        return this.getMatches(targetGridX, targetGridY).length > 0;
    }

    getMatches(targetGridX, targetGridY)
    {
        const self = this;
        const matchedTiles = [];

        self.forEachTile((tile, x, y) => {

            if(
                (typeof targetGridX !== 'undefined' && x !== targetGridX) &&
                (typeof targetGridY !== 'undefined' && y !== targetGridY)
              )
            {
                return;
            }

            const targetTileType = tile.tileType;
            const matchedXTiles = [];
            const matchedYTiles = [];

            // Check for matches to the right
            let currX = (x + 1);
            while(currX < self.tileWidth)
            {
                const currTile = self.tileGrid[y][currX];

                if(currTile != null && targetTileType.name === currTile.tileType.name)
                {
                    matchedXTiles.push(currTile);
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
                const currTile = self.tileGrid[y][currX];

                if(currTile != null && targetTileType.name === currTile.tileType.name)
                {
                    matchedXTiles.push(currTile);
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
                const currTile = self.tileGrid[currY][x];

                if(currTile != null && targetTileType.name === currTile.tileType.name)
                {
                    matchedYTiles.push(currTile);
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
                const currTile = self.tileGrid[currY][x];

                if(currTile != null && targetTileType === currTile.tileType)
                {
                    matchedYTiles.push(currTile);
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
                const currTile = this.tileGrid[y][x];

                if(currTile != null)
                {
                    callback(this.tileGrid[y][x], x, y);
                }
            }
        }
    }
}