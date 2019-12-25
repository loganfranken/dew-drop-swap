export default class {

    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.scoreText = null;
        this.comboText = null;
        this.score = 0;
    }

    create(context)
    {
        this.scoreText = context.add.text(this.x, this.y, this.score);
        this.comboText = context.add.text(this.x, this.y + 20, '');
    }

    updateScore(score)
    {
        this.score = score;
        this.scoreText.setText(score);
    }

    updateCombo(text)
    {
        this.comboText.setText(text);
    }
}