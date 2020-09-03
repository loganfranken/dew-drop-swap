import FontStyleManifest from './FontStyleManifest';

export default class {

    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.scoreText = null;
        this.score = 0;
    }

    create(context)
    {
        // Background
        const scoreBackgroundGraphics = context.add.graphics({ fillStyle: { color: 0xdbf0ff } }).setAlpha(0.5);
        scoreBackgroundGraphics.fillRoundedRect(this.x - 150, this.y - 10, 300, 90, 10);

        // Icon
        context.add.image(this.x + 15, this.y + 15, 'icon_tile').setAlpha(0.7);

        // Text
        this.scoreText = context.add.text(this.x + 40, this.y, this.score, FontStyleManifest.Default);
        this.updateScore(this.score);
    }

    updateScore(score)
    {
        this.score = score;
        this.scoreText.setText(score);
    }
}