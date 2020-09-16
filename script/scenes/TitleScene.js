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
        this.load.image('start-active', 'assets/start_active.png');
        this.load.image('tile_01', 'assets/tile_01.png');
        this.load.image('tile_02', 'assets/tile_02.png');
        this.load.image('tile_03', 'assets/tile_03.png');
        this.load.image('tile_04', 'assets/tile_04.png');
    }

    create()
    {
        const self = this;

        // Background
        this.add.image(400, 330, 'background');

        // Flash Backdrop
        const flashBackdropGraphics = this.add.graphics({ fillStyle: { color: 0xffffff } });
        flashBackdropGraphics.setAlpha(0);
        const flashBackdrop = new Phaser.Geom.Rectangle(0, 0, 800, 700);
        flashBackdropGraphics.fillRectShape(flashBackdrop);

        // Tile
        const tileInfos = [];
        tileInfos.push({ imageKey: 'tile_01', xChange: '+=180', yChange: '+=180', angle: 15, scale: 0.8 });
        tileInfos.push({ imageKey: 'tile_02', xChange: '+=200', yChange: '-=180', angle: 15, scale: 1 });
        tileInfos.push({ imageKey: 'tile_03', xChange: '-=180', yChange: '+=180', angle: -15, scale: 0.9 });
        tileInfos.push({ imageKey: 'tile_04', xChange: '-=200', yChange: '-=180', angle: -5, scale: 0.8 });
        tileInfos.push({ imageKey: 'tile_01', xChange: '+=0', yChange: '-=180', angle: -15, scale: 0.7 });
        tileInfos.push({ imageKey: 'tile_02', xChange: '+=0', yChange: '+=180', angle: -15, scale: 1 });
        tileInfos.push({ imageKey: 'tile_03', xChange: '+=290', yChange: '+=30', angle: 15, scale: 0.8 });
        tileInfos.push({ imageKey: 'tile_01', xChange: '-=290', yChange: '+=40', angle: -15, scale: 0.9 });

        tileInfos.forEach(tileInfo => {
            tileInfo.tile = self.add.image(400, 230, tileInfo.imageKey);
            tileInfo.tile.setAlpha(0);
            tileInfo.tile.setScale(0.5, 0.5);
        });

        // Title
        const title = this.add.image(400, 230, 'title');
        title.setAlpha(0);
        title.setScale(2, 2);

        const startBtn = this.add.image(400, 550, 'start');
        startBtn.setInteractive({ cursor: 'pointer' });
        startBtn.setAlpha(0);

        const startBtnFlash = this.add.image(400, 550, 'start');
        startBtnFlash.setAlpha(0);
        startBtnFlash.setTintFill(0xffffff);

        const startBtnOverlay = this.add.image(400, 550, 'start-active');
        startBtnOverlay.setAlpha(0);

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

        startBtn.on('pointerdown', () => {
            self.scene.transition({ target: 'RoundScene', data: { level: 0 }, remove: true });
        });

        // Intro Timeline
        const introTimeline = this.tweens.createTimeline();

        // Slam in the title
        introTimeline.add({
            delay: 400,
            targets: title,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Quad.easeIn'
        });

        // Fling the tiles from the impact of the title slam
        tileInfos.forEach((tileInfo, i) => {
            introTimeline.add({
                targets: tileInfo.tile,
                x: tileInfo.xChange,
                y: tileInfo.yChange,
                scaleX: 1,
                scaleY: 1,
                alpha: 1,
                scaleX: tileInfo.scale,
                scaleY: tileInfo.scale,
                angle: tileInfo.angle,
                duration: 300,
                ease: 'Quad.easeOut',
                offset: (i === 0) ? '-=0' : '-=300'
            });
        });

        // Display the flash from the title slam
        introTimeline.add({
            targets: flashBackdropGraphics,
            alpha: 1,
            duration: 30,
            offset: '-=300'
        });

        // Fade out the flash from the title slam
        introTimeline.add({
            targets: flashBackdropGraphics,
            alpha: 0,
            duration: 700,
            offset: 1500,
            ease: 'Quad.easeIn'
        });

        // Flash in the start button
        introTimeline.add({
            targets: [ startBtn, startBtnFlash ],
            alpha: 1,
            offset: 2200,
            duration: 100
        });

        // Fade out the start button flash effect
        introTimeline.add({
            targets: startBtnFlash,
            alpha: 0,
            duration: 300,
            offset: 2300,
            ease: 'Quad.easeOut'
        });

        introTimeline.play();
    }
    
}