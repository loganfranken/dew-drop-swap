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
        this.isActivated = false;
        this.isDestroying = false;
    }

    create(context)
    {
        this.image = context.add.image(this.x, this.y, this.tileType.imageKey);
        this.image.setInteractive();
        this.image.on('pointerdown', () => { this.onTileSelect(context, this); });
    }

    activate()
    {
        this.isActivated = true;
        this.image.setTintFill(0xffffff);
    }

    deactivate()
    {
        this.isActivated = false;
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

            context.tweens.add({
                targets: self.image,
                x: x,
                y: y,
                ease: 'Power1',
                duration: 500,
                onComplete: () => { resolve() }
            });

        });
    }

    destroy(context, container)
    {
        let self = this;
        
        if(self.isDestroying)
        {
            return;
        }

        self.isDestroying = true;

        // Create cover for fading the shape to white
        const fadeOutCover = context.add.image(self.x, self.y, self.tileType.imageKey);
        fadeOutCover.setTintFill(0xffffff);
        fadeOutCover.alpha = 0;

        // Create particles for "explosion" effect
        const particleGraphics = [];
        for(let i=0; i<4; i++)
        {
            const explodeParticleGraphics = context.add.graphics({ fillStyle: { color: 0xffffff }, alpha: 0 });
            const explodeParticle = new Phaser.Geom.Circle(this.x, this.y, Phaser.Math.Between(0, 10));
            explodeParticleGraphics.fillCircleShape(explodeParticle);
            particleGraphics.push(explodeParticleGraphics);
        }

        return new Promise((resolve, reject) => {

           context.tweens.add({
               targets: fadeOutCover,
               alpha: 1,
               duration: 200,
               onComplete: () => {

                    // Remove the tile image
                    container.remove(self.image);
                    self.image.destroy();
                    self.state = TileState.Destroyed;

                    // Remove the fade out cover
                    container.remove(fadeOutCover);
                    fadeOutCover.destroy();

                    // Remove the particles
                    particleGraphics.forEach((graphics) => {
                        container.remove(graphics);
                        graphics.destroy();
                    });

                    resolve();
               }
           });

           particleGraphics.forEach((graphics, index) => {

                let xSign = '';
                let ySign = '';
               
                switch(index)
                {
                    case 1:
                        xSign = '-';
                        ySign = '-';
                        break;

                    case 2:
                        xSign = '+';
                        ySign = '+';
                        break;

                    case 3:
                        xSign = '+';
                        ySign = '-';
                        break;

                    case 4:
                        xSign = '-';
                        ySign = '+';
                        break;
                }

                context.tweens.add({
                    targets: graphics,
                    x: xSign + '=35',
                    y: ySign + '=35',
                    alpha: 1,
                    duration: 200,
                    ease: 'Cubic.easeOut'
                });
           });

        });
    }
}