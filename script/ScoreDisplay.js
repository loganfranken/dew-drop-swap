import FontStyleManifest from './FontStyleManifest';

export default class {

    constructor(x, y, isIntro)
    {
        this.x = x;
        this.y = y;
        this.isIntro = isIntro;

        this.scoreBackground = null;
        this.scoreIcon = null;
        this.scoreText = null;

        this.score = 0;
    }

    create(context)
    {
        // Background
        this.scoreBackground = context.add.graphics({ fillStyle: { color: 0x85ff7d } });
        this.scoreBackground.setAlpha(this.isIntro ? 0 : 0.25);

        this.scoreBackground.fillRoundedRect(this.x - 150, this.y - 10, 300, 90, 10);

        // Icon
        this.scoreIcon = context.add.image(this.x + 15, this.y + 15, 'icon_tile');
        this.scoreIcon.setAlpha(this.isIntro ? 0 : 0.7);

        // Text
        this.scoreText = context.add.text(this.x + 40, this.y, this.score, FontStyleManifest.Default);

        if(this.isIntro)
        {
            this.scoreText.setAlpha(0);
        }

        this.updateScore(this.score);
    }

    updateScore(score)
    {
        this.score = score;
        this.scoreText.setText(score);
    }

    show(context)
    {
        context.tweens.add({
            targets: this.scoreBackground,
            duration: 250,
            alpha: 0.25
        });

        context.tweens.add({
            targets: this.scoreIcon,
            duration: 250,
            alpha: 0.7
        });

        context.tweens.add({
            targets: this.scoreText,
            duration: 250,
            alpha: 1
        });
    }

    hide(context)
    {
        context.tweens.add({
            targets: [ this.scoreBackground, this.scoreIcon, this.scoreText ],
            x: '-=300',
            duration: 300
        });
    }
}