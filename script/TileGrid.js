import { getRandomItem } from './Utility';
import Tile from './Tile';
import TileGenerationBehavior from './TileGenerationBehavior';
import TileState from './TileState';
import TileType from './TileType';

export default class {

    constructor(tileGridWidth, tileGridHeight, tileSize, offsetX, offsetY, onTileSelect, onTileMatch, queue)
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
        this.onTileMatch = onTileMatch;

        this.queue = queue;

        // We're going to generate a grid that's twice the height of
        // the desired tile grid height since we'll use the hidden, upper
        // region to stage the bricks that will fall into the play area
        for(let y = 0; y < tileGridHeight * 2; y++)
        {
            this.tileGrid[y] = [];
            for(let x = 0; x < tileGridWidth; x++)
            {
                this.tileGrid[y][x] = (y < tileGridHeight)
                    ? null
                    : this.createTile(this.getTileType(x, y, TileGenerationBehavior.None), x, y);
            }
        }
    }

    create(context)
    {
        this.tileImageContainer = context.add.container();

        // Create all of the tiles
        this.forEachTile(tile => {

            if(tile === null)
            {
                return;
            }

            tile.create(context);
            this.tileImageContainer.add(tile.image);

        });

        // Create a mask to only show the play area
        const maskShape = context.make.graphics();
        maskShape.fillStyle(0xffffff, 1);
        maskShape.fillRect(this.offsetX/2, this.offsetY/2 + (this.tileGridHeight * this.tileSize), this.tileGridWidth * this.tileSize, this.tileGridHeight * this.tileSize);
        
        this.tileImageContainer.mask = new Phaser.Display.Masks.GeometryMask(context, maskShape);
    }

    update(context)
    {
        const self = this;

        if(self.queue.length > 0)
        {
            return;
        }

        // Detect and destroy any matches
        const matchedTiles = self.getMatches();

        if(matchedTiles.length > 0)
        {
            self.onTileMatch(context, matchedTiles);
        }

        let destroys = [];
        matchedTiles.forEach(t => { destroys.push(t.destroy(context, this.tileImageContainer)); });

        if(destroys.length > 0)
        {
            self.queue.push(() => { return Promise.all(destroys); });
        }

        // Remove any destroyed tiles
        self.forEachTile((tile, x, y) => {

            if(tile === null)
            {
                return;
            }

            if(tile.state === TileState.Destroyed)
            {
                self.tileGrid[y][x] = null;
            }

        });

        // Shift all of the tiles downward to fill empty spots
        let drops = [];
        for(let x = 0; x < this.tileGridWidth; x++)
        {
            let y = (this.tileGridHeight * 2) - 1;
            while(y >= 0)
            {
                // If the tile is null...
                if(self.tileGrid[y][x] === null)
                {
                    // ...find the closest tile that's not null...
                    let closestY = y - 1;
                    while(closestY >= 0)
                    {
                        let closestTile = self.tileGrid[closestY][x];
                        if(closestTile !== null)
                        {
                            // ...and shift it downward
                            self.tileGrid[y][x] = closestTile;
                            self.tileGrid[closestY][x] = null;
                            drops.push(this.getTileDrop(context, closestTile, x, y));
                            y--;
                        }
                        closestY--;
                    }
                }

                y--;
            }
        }

        // Fill in all of the empty tiles
        self.forEachPlayableTile((tile, x, y) => {
            if(tile === null)
            {
                const adjustedY = y - self.tileGridHeight;

                const tile = self.createTile(self.getTileType(x, y, TileGenerationBehavior.EasyWin), x, adjustedY);
                self.tileGrid[adjustedY][x] = tile;
                tile.create(context);
                self.tileImageContainer.add(tile.image);
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

            if(!this.isPlayable(tile))
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
                callback(this.tileGrid[y][x], x, y);
            }
        }
    }

    forEachPlayableTile(callback)
    {
        for(let y = this.tileGridHeight; y < this.tileGridHeight * 2; y++)
        {
            for(let x = 0; x < this.tileGridWidth; x++)
            {
                callback(this.tileGrid[y][x], x, y);
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
        return this.offsetY + (this.tileSize * y);
    }

    canSelect(tile)
    {
        return this.isPlayable(tile);
    }

    isPlayable(tile)
    {
        return (tile != null) && (tile.tileGridY > (this.tileGridHeight - 1));
    }

    getTileType(x, y, behavior)
    {
        const aboveTile = (y < 1) ? null : this.tileGrid[y - 1][x];
        const belowTile = (y > self.tileGridHeight - 1 || !this.tileGrid[y + 1]) ? null : this.tileGrid[y + 1][x];

        const leftTile = (x < 1) ? null : this.tileGrid[y][x - 1];
        const rightTile = (x > self.tileGridWidth - 1) ? null : this.tileGrid[y][x + 1];

        if(behavior == TileGenerationBehavior.EasyWin && (aboveTile != null || belowTile != null || leftTile != null || rightTile != null))
        {
            return getRandomItem([aboveTile, belowTile, leftTile, rightTile].filter(t => t != null).map(t => t.tileType));
        }
        else
        {
            return getRandomItem(TileType.filter(t =>
                (aboveTile === null || t.name !== aboveTile.tileType.name) &&
                (leftTile === null || t.name !== leftTile.tileType.name)
            ));
        }
    }
}