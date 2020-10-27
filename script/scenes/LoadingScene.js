
import FontStyleManifest from '../FontStyleManifest';
import WebFontLoader from 'webfontloader';

export default class extends Phaser.Scene {

    constructor()
    {
        super('LoadingScene');
    }

    preload()
    {
        WebFontLoader.load({
            google: {
                families: [FontStyleManifest.Default.googleFontName]
            }
        });

        // Images: Tiles
        this.load.image('tile_01', 'assets/images/tile_01.png');
        this.load.image('tile_02', 'assets/images/tile_02.png');
        this.load.image('tile_03', 'assets/images/tile_03.png');
        this.load.image('tile_04', 'assets/images/tile_04.png');

        // Images: Guide
        this.load.image('guide_character', 'assets/images/guide.png');

        // Images: Background
        this.load.image('background', [ 'assets/images/background.png', 'assets/images/background_n.png' ]);

        // Images: Load
        this.load.image('load_start', 'assets/images/load_start.png');

        // Images: Title
        this.load.image('title', 'assets/images/title.png');
        this.load.image('start', 'assets/images/start.png');
        this.load.image('start-active', 'assets/images/start_active.png');

        // Images: Round Clear
        this.load.image('round_clear', 'assets/images/round_clear.png');
        this.load.image('round_clear_backdrop', 'assets/images/round_clear_backdrop.png');

        // Images: Icons
        this.load.image('icon_tile', 'assets/images/icon_tile.png');
        this.load.image('icon_timer', 'assets/images/icon_timer.png');
        this.load.image('icon_timer_warning', 'assets/images/icon_timer_warning.png');
        this.load.image('icon_audio', 'assets/images/icon_audio.png');
        this.load.image('icon_audio_mute', 'assets/images/icon_audio_mute.png');

        // Images: Expressions
        this.load.image('expression_default', 'assets/images/expression_default.png');
        this.load.image('expression_surprise', 'assets/images/expression_surprise.png');
        this.load.image('expression_sadness', 'assets/images/expression_sadness.png');
        this.load.image('expression_despair', 'assets/images/expression_despair.png');
        this.load.image('expression_glee', 'assets/images/expression_glee.png');
        this.load.image('expression_nervous', 'assets/images/expression_nervous.png');
        this.load.image('expression_confused', 'assets/images/expression_confused.png');
        this.load.image('expression_neutral', 'assets/images/expression_neutral.png');
        this.load.image('expression_amused', 'assets/images/expression_amused.png');
        this.load.image('expression_thoughtful', 'assets/images/expression_thoughtful.png');

        // Music
        this.load.audio('background_music', 'assets/sounds/background_music.mp3');

        // Sound Effects
        this.load.audio('match', 'assets/sounds/match.mp3');
        this.load.audio('match_combo_01', 'assets/sounds/match_combo_01.mp3');
        this.load.audio('match_combo_02', 'assets/sounds/match_combo_02.mp3');
        this.load.audio('match_combo_03', 'assets/sounds/match_combo_03.mp3');
        this.load.audio('match_combo_04', 'assets/sounds/match_combo_04.mp3');
        this.load.audio('match_combo_05', 'assets/sounds/match_combo_05.mp3');
        this.load.audio('swap', 'assets/sounds/swap.mp3');
        this.load.audio('tile_select', 'assets/sounds/tile_select.mp3');
        this.load.audio('warning_tick', 'assets/sounds/warning_tick.mp3');
        this.load.audio('timer_run_out', 'assets/sounds/timer_run_out.mp3');
        this.load.audio('lights_off', 'assets/sounds/lights_out.mp3');
        this.load.audio('round_clear', 'assets/sounds/intro_slide.mp3');
        this.load.audio('select', 'assets/sounds/select.mp3');
        this.load.audio('intro_slide', 'assets/sounds/intro_slide.mp3');
        this.load.audio('music_switch', 'assets/sounds/music_switch.mp3');

        // Loading Graphics
        // Based on: https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/

        const background = this.add.graphics();
        background.fillStyle(0x111111);
        background.fillRect(0, 0, 800, 700);

        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(240, 330, 320, 50);

        const self = this;
        this.progressBar = this.add.graphics();
        this.load.on('progress', function (value) {
            self.progressBar.clear();
            self.progressBar.fillStyle(0xffffff, 0.8);
            self.progressBar.fillRect(250, 340, 300 * value, 30);
        });
    }

    create()
    {
        this.tweens.add({
            targets: [this.progressBox, this.progressBar],
            alpha: 0,
            duration: 200
        });

        const self = this;
        this.startBtn = this.add.image(400, 350, 'load_start');
        this.startBtn.setInteractive({ cursor: 'pointer' });
        this.startBtn.setAlpha(0);
        this.startBtn.on('pointerdown', () => {
            self.scene.transition({ target: 'TitleScene', remove: true });
        });

        this.tweens.add({
            targets: [this.startBtn],
            alpha: 1,
            duration: 200
        });
    }
}