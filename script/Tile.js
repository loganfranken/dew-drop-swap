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
        this.image.on('pointerdown', () => { this.onTileSelect(context, this); });
    }

    activate()
    {
        this.image.setTintFill(0xffffff);
    }

    deactivate()
    {
        this.image.clearTint();
    }

    updatePosition(context, x, y, tileGridX, tileGridY)
    {
        let self = this;

        return new Promise((resolve, reject) => {

            self.x = x;
            self.y = y;
            self.tileGridX = tileGridX;
            self.tileGridY = tileGridY;
    
            //this.image.x = x;
            //this.image.y = y;
    
            context.tweens.add({
                targets: self.image,
                x: x,
                y: y,
                ease: 'Power1',
                duration: 5000,
                //yoyo: true,
                //repeat: 1,
                //onStart: function () { console.log('onStart'); console.log(arguments); },
                onComplete: () => { resolve() },
                //onYoyo: function () { console.log('onYoyo'); console.log(arguments); },
                //onRepeat: function () { console.log('onRepeat'); console.log(arguments); },
            });

        });
    }

    destroy()
    {
        this.image.destroy();
        this.state = TileState.Destroyed;
    }
}