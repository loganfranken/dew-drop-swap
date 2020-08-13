export default class extends Phaser.Scene {

    constructor()
    {
        super('TitleScene');
    }

    preload()
    {
        this.load.image('background', 'assets/background.png');
        this.load.image('title', 'assets/title.png');
        this.load.image('start', 'assets/start.png');
        this.load.image('start-glow', 'assets/start_glow.png');
        this.load.image('start-active', 'assets/start_active.png');
    }

    create()
    {
        const self = this;

        // Background
        this.add.image(400, 400, 'background');

        // Flash Backdrop
        const flashBackdropGraphics = this.add.graphics({ fillStyle: { color: 0xffffff } });
        flashBackdropGraphics.setAlpha(0);
        const flashBackdrop = new Phaser.Geom.Rectangle(0, 0, 800, 700);
        flashBackdropGraphics.fillRectShape(flashBackdrop);

        // Title
        const title = this.add.image(400, 200, 'title');
        title.setAlpha(0);
        title.setScale(2, 2);

        // "Start" Button
        //const startBtnGlow = this.add.image(400, 550, 'start-glow');
        //startBtnGlow.setAlpha(0);

        const startBtn = this.add.image(400, 550, 'start');
        startBtn.setInteractive({ cursor: 'pointer' });
        startBtn.setAlpha(0);

        const startBtnOverlay = this.add.image(400, 550, 'start');
        startBtnOverlay.setAlpha(0);
        startBtnOverlay.setTintFill(0xffffff);

        //const startBtnOverlay = this.add.image(400, 550, 'start-active');
        //startBtnOverlay.setAlpha(0);

        /*
        startBtn.on('pointerover', () => {
            self.tweens.add({
                targets: startBtnOverlay,
                alpha: 1,
                duration: 100,
                ease: 'Sine.easeInOut'
            });
        });

        startBtn.on('pointerout', () => {
            self.tweens.add({
                targets: startBtnOverlay,
                alpha: 0,
                duration: 100,
                ease: 'Sine.easeInOut'
            });
        });
        */

        startBtn.on('pointerdown', () => { self.scene.start('RoundScene', { level: 0 }); });

        // Intro Timeline
        const introTimeline = this.tweens.createTimeline();

        introTimeline.add({
            delay: 400,
            targets: title,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Quad.easeIn'
        });

        introTimeline.add({
            targets: flashBackdropGraphics,
            alpha: 1,
            duration: 30
        });

        introTimeline.add({
            targets: flashBackdropGraphics,
            alpha: 0,
            duration: 700,
            ease: 'Quad.easeIn'
        });

        introTimeline.add({
            targets: [ startBtn, startBtnOverlay ],
            alpha: 1,
            duration: 100
        });

        introTimeline.add({
            targets: startBtnOverlay,
            alpha: 0,
            duration: 300,
            ease: 'Quad.easeOut'
        });

        /*
        introTimeline.add({
            targets: startBtnGlow,
            alpha: 1,
            duration: 1000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
        */

        introTimeline.play();
    }
    
}