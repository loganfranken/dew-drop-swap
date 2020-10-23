import { getRandomItem } from "../Utility";
import MuteControl from "../MuteControl";

export default class extends Phaser.Scene {

    constructor()
    {
        super('TitleScene');

        this.startingLevel = 0;

        this.isExiting = false;

        this.tileInfos = [];
        this.title = null;
        this.startBtn = null;
        this.startBtnOverlay = null;
    }

    preload()
    {
        // Images
        this.load.image('background', [ 'assets/images/background.png', 'assets/images/background_n.png' ]);
        this.load.image('title', 'assets/images/title.png');
        this.load.image('start', 'assets/images/start.png');
        this.load.image('start-active', 'assets/images/start_active.png');
        this.load.image('tile_01', 'assets/images/tile_01.png');
        this.load.image('tile_02', 'assets/images/tile_02.png');
        this.load.image('tile_03', 'assets/images/tile_03.png');
        this.load.image('tile_04', 'assets/images/tile_04.png');
        this.load.image('icon_audio', 'assets/images/icon_audio.png');
        this.load.image('icon_audio_mute', 'assets/images/icon_audio_mute.png');

        // Music
        this.load.audio('background_music', 'assets/sounds/background_music.mp3');

        // Sound Effects
        this.load.audio('select', 'assets/sounds/select.mp3');
        this.load.audio('intro_slide', 'assets/sounds/intro_slide.mp3');
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
        this.tileInfos = [];
        this.tileInfos.push({ imageKey: 'tile_01', xChange: '+=180', yChange: '+=180', angle: 15, scale: 0.8 });
        this.tileInfos.push({ imageKey: 'tile_03', xChange: '-=180', yChange: '+=180', angle: -15, scale: 0.9 });
        this.tileInfos.push({ imageKey: 'tile_04', xChange: '-=200', yChange: '-=180', angle: -5, scale: 0.8 });
        this.tileInfos.push({ imageKey: 'tile_01', xChange: '+=0', yChange: '-=180', angle: -15, scale: 0.7 });
        this.tileInfos.push({ imageKey: 'tile_02', xChange: '+=200', yChange: '-=180', angle: 15, scale: 1 });
        this.tileInfos.push({ imageKey: 'tile_02', xChange: '+=0', yChange: '+=180', angle: -15, scale: 1 });
        this.tileInfos.push({ imageKey: 'tile_03', xChange: '+=290', yChange: '+=30', angle: 15, scale: 0.8 });
        this.tileInfos.push({ imageKey: 'tile_01', xChange: '-=290', yChange: '+=40', angle: -15, scale: 0.9 });

        this.tileInfos.forEach(tileInfo => {
            tileInfo.tile = self.add.image(400, 230, tileInfo.imageKey);
            tileInfo.tile.setAlpha(0);
            tileInfo.tile.setScale(0.5, 0.5);

            tileInfo.tileFlash = self.add.image(400, 230, tileInfo.imageKey);
            tileInfo.tileFlash.setTintFill(0xffffff);
            tileInfo.tileFlash.setAlpha(0);
        });

        // Title
        this.title = this.add.image(400, 230, 'title');
        this.title.setAlpha(0);
        this.title.setScale(2, 2);

        this.startBtn = this.add.image(400, 540, 'start');
        this.startBtn.setInteractive({ cursor: 'pointer' });
        this.startBtn.setAlpha(0);

        const startBtnFlash = this.add.image(400, 540, 'start');
        startBtnFlash.setAlpha(0);
        startBtnFlash.setTintFill(0xffffff);

        this.startBtnOverlay = this.add.image(400, 540, 'start-active');
        this.startBtnOverlay.setAlpha(0);

        // Mute Button
        const muteControl = new MuteControl(40, 640);
        muteControl.create(this);

        this.startBtn.on('pointerover', () => {
            self.tweens.add({
                targets: self.startBtnOverlay,
                alpha: 1,
                duration: 100,
                ease: 'Sine.easeInOut'
            });
        });

        this.startBtn.on('pointerout', () => {
            self.tweens.add({
                targets: self.startBtnOverlay,
                alpha: 0,
                duration: 100,
                ease: 'Sine.easeInOut'
            });
        });

        this.selectSound = this.sound.add('select');
        this.startBtn.on('pointerdown', () => {
            self.transitionToNextScene();
        });

        // Intro Timeline
        const introTimeline = this.tweens.createTimeline();

        // Slam in the title
        introTimeline.add({
            delay: 800,
            targets: this.title,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Quad.easeIn'
        });

        // Fling the tiles from the impact of the title slam
        this.tileInfos.forEach((tileInfo, i) => {
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

        this.game.backgroundMusic = this.sound.add('background_music');
        this.game.backgroundMusic.loop = true;
        this.game.backgroundMusic.play();

        const introSlideSound = this.sound.add('intro_slide');

        // Display the flash from the title slam
        introTimeline.add({
            targets: flashBackdropGraphics,
            alpha: 1,
            duration: 30,
            offset: '-=300',
            onComplete: () => {
                introSlideSound.play();
            }
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
            targets: [ this.startBtn, startBtnFlash ],
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
            ease: 'Quad.easeOut',
            onComplete: this.flashTiles.apply(self)
        });

        introTimeline.add({
            targets: this.title,
            scaleX: 1.02,
            scaleY: 1.02,
            yoyo: true,
            repeat: -1,
            duration: 500,
            offset: 2600,
            ease: 'Quad'
        });

        introTimeline.play();
    }

    flashTiles()
    {
        const self = this;

        // Start randomly flashing tiles
        self.time.addEvent({
            delay: 3000,
            callback: () => {
                if(self.isExiting)
                {
                    return;
                }

                const tileInfo = getRandomItem(self.tileInfos);

                tileInfo.tileFlash.x = tileInfo.tile.x;
                tileInfo.tileFlash.y = tileInfo.tile.y;
                tileInfo.tileFlash.angle = tileInfo.tile.angle;
                tileInfo.tileFlash.scaleX = tileInfo.tile.scaleX;
                tileInfo.tileFlash.scaleY = tileInfo.tile.scaleY;

                self.tweens.add({
                    targets: tileInfo.tileFlash,
                    alpha: 1,
                    duration: 10
                });

                self.tweens.add({
                    targets: tileInfo.tileFlash,
                    alpha: 0,
                    duration: 1000,
                    ease: 'Power1',
                    delay: 10
                });

                self.tweens.add({
                    targets: [ tileInfo.tile, tileInfo.tileFlash ],
                    scaleX: '*=1.1',
                    scaleY: '*=1.1',
                    duration: 500,
                    yoyo: true,
                    ease: 'Power1'
                });
            },
            callbackScope: this,
            loop: true
        });
    }

    transitionToNextScene()
    {
        const self = this;

        this.isExiting = true;

        this.selectSound.play();
        this.startBtn.setAlpha(0);

        const exitTimeline = this.tweens.createTimeline();

        this.tileInfos.forEach((tileInfo, i) => {
            exitTimeline.add({
                targets: [ tileInfo.tile, tileInfo.tileFlash ],
                x: tileInfo.xChange,
                y: tileInfo.yChange,
                alpha: 0,
                duration: 500,
                offset: (i === 0) ? '-=0' : '-=1000',
                ease: 'Quad.easeOut'
            });
        });

        exitTimeline.add({
            targets: this.title,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 700,
            offset: '-=1000',
            alpha: 0,
            ease: 'Quad.easeOut'
        });

        exitTimeline.add({
            targets: this.startBtnOverlay,
            y: '+=300',
            duration: 500,
            offset: '-=1000',
            ease: 'Quad.easeOut',
            completeDelay: 300,
            onComplete: () => {
                self.scene.transition({ target: 'RoundScene', data: { level: self.startingLevel }, remove: true });
            }
        });

        exitTimeline.play();
    }
}