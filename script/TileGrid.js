import { getRandomItem } from './Utility';
import Tile from './Tile';
import TileType from './TileType';
import TileState from './TileState';
import { isBuffer } from 'util';

export default class {

    constructor(tileGridWidth, tileGridHeight, tileSize, offsetX, offsetY, onTileSelect, queue)
    {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.tileSize = tileSize;
        this.tileGridHeight = tileGridHeight;
        this.tileGridWidth = tileGridWidth;
        this.tileGrid = [];
        this.tileImageContainer = null;
        this.playAreaOffset = (this.tileGridHeight * this.tileSize);
        this.onTileSelect = onTileSelect;
        this.queue = queue;

        // We're going to generate a grid that's twice the height of
        // the desired tile grid height since we'll use the hidden, upper
        // region to stage the bricks that will fall into the play area
        for(let y = 0; y < tileGridHeight * 2; y++)
        {
            this.tileGrid[y] = [];
            for(let x = 0; x < tileGridWidth; x++)
            {
                const aboveTile = (y < 1) ? null : this.tileGrid[y - 1][x];
                const leftTile = (x < 1) ? null : this.tileGrid[y][x - 1];

                const tileType = getRandomItem(TileType.filter(t =>
                    (aboveTile === null || t.name !== aboveTile.tileType.name) &&
                    (leftTile === null || t.name !== leftTile.tileType.name)
                ));

                this.tileGrid[y][x] = this.createTile(tileType, x, y);
            }
        }
    }

    create(context)
    {
        this.tileImageContainer = context.add.container();

        // Create all of the tiles
        this.forEachTile(tile => {
            tile.create(context);
            this.tileImageContainer.add(tile.image);
        });

        // Create a mask to only show the play area
        const maskShape = context.make.graphics();
        maskShape.fillStyle(0xffffff, 1);
        maskShape.fillRect(this.offsetX/2, this.offsetY/2, this.tileGridWidth * this.tileSize, this.tileGridHeight * this.tileSize);
        
        //this.tileImageContainer.mask = new Phaser.Display.Masks.GeometryMask(context, maskShape);
    }

    update(context)
    {
        const self = this;

        // Detect and destroy any matches
        const matchedTiles = self.getMatches();

        let destroys = [];
        matchedTiles.forEach(t => { destroys.push(t.destroy(context, this.tileImageContainer)); });

        if(destroys.length > 0)
        {
            self.queue.push(() => { return Promise.all(destroys); });
        }

        // Remove any destroyed tiles
        let bottomEmptyTiles = [];
        self.forEachTile((tile, x, y) => {

            if(self.tileGrid[y][x].state === TileState.Destroyed)
            {
                self.tileGrid[y][x] = null;

                // Cache the bottom-most empty tiles
                let otherEmptyTile = bottomEmptyTiles.find(e => e.x === x);
                if(typeof otherEmptyTile === "undefined")
                {
                    bottomEmptyTiles.push({ x, y });
                }
                else
                {
                    otherEmptyTile.y = y;
                }

            }

        });

        let drops = [];
        bottomEmptyTiles.forEach(({x, y}) => {

            // First, find the closest tile above this empty tile
            let closestTile = null;
            let closestTileY = y;

            while(closestTileY >= 0)
            {
                closestTile = self.tileGrid[closestTileY][x];

                if(closestTile != null)
                {
                    break;
                }

                closestTileY--;
            }

            // Second, set up that tile and all of the tiles above it for dropping
            if(closestTile != null)
            {
                let currY = y;
                while(closestTileY >= 0)
                {
                    if(closestTile === null)
                    {
                        currY--;
                        closestTileY--;
                        continue;
                    }

                    self.tileGrid[closestTileY][x] = null;
                    self.tileGrid[currY][x] = closestTile;
                    drops.push(this.getTileDrop(context, closestTile, x, currY));

                    currY--;
                    closestTileY--;

                    if(closestTileY >= 0)
                    {
                        closestTile = self.tileGrid[closestTileY][x];
                    }
                }
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
            while(currX < self.tileGridWidth)
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
            while(currY < self.tileGridHeight)
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
        for(let y = 0; y < this.tileGridHeight * 2; y++)
        {
            for(let x = 0; x < this.tileGridWidth; x++)
            {
                const currTile = this.tileGrid[y][x];

                if(currTile != null)
                {
                    callback(this.tileGrid[y][x], x, y);
                }
            }
        }
    }

    createTile(tileType, x, y)
    {
        return new Tile(tileType, this.getTileX(x), this.getTileY(y), x, y, this.onTileSelect);
    }

    getTileDrop(context, tile, x, y)
    {
        return tile.updatePosition(context, this.getTileX(x), this.getTileY(y), x, y);
    }

    getTileX(x)
    {
        return this.offsetX + (this.tileSize * x);
    }

    getTileY(y)
    {
        //return this.offsetY + (this.tileSize * y) - this.playAreaOffset;
        return this.offsetY + (this.tileSize * y);
    }

    canSelect(tile)
    {
        return (tile.tileGridY > (this.tileGridHeight - 1));
    }
}