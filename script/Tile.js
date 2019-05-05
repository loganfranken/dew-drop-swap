import TileState from './TileState';

export default class {

    constructor(tileType, x, y, tileGridX, tileGridY, onTileSelect)
    {
        this.tileType = tileType;
        this.x = x;
        this.y = y;
        this.tileGridX = tileGridX;
        this.tileGridY = tileGridY;
        this.onTileSelect = onTileSelect;
        this.image = null;
        this.state = TileState.Active;
    }

    create(context)
    {
        this.image = context.add.image(this.x, this.y, this.tileType.imageKey);
        this.image.setInteractive();
        this.image.on('pointerdown', () => { this.onTileSelect(this); });
    }

    activate()
    {
        this.image.setTintFill(0xffffff);
    }

    deactivate()
    {
        this.image.clearTint();
    }

    updatePosition(x, y, tileGridX, tileGridY)
    {
        this.x = x;
        this.y = y;
        this.tileGridX = tileGridX;
        this.tileGridY = tileGridY;

        this.image.x = x;
        this.image.y = y;
    }

    destroy()
    {
        this.image.destroy();
        this.state = TileState.Destroyed;
    }
}