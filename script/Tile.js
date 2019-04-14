export default class {

    constructor(tileType, x, y, onTileSelect)
    {
        this.tileType = tileType;
        this.x = x;
        this.y = y;
        this.onTileSelect = onTileSelect;
        this.image = null;
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
}