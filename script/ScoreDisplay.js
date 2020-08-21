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
        const scoreBackgroundGraphics = context.add.graphics({ fillStyle: { color: 0xdbf0ff } }).setAlpha(0.5);
        scoreBackgroundGraphics.fillRoundedRect(this.x - 150, this.y - 10, 300, 80, 10);

        const scoreTextStyle = {
            color: '#000',
            fontFamily: '"Baloo Thambi 2"',
            fontStyle: 'bold',
            fontSize: '30px'
        };

        this.scoreText = context.add.text(this.x, this.y, this.score, scoreTextStyle);
        this.updateScore(this.score);

        this.comboText = context.add.text(this.x, this.y + 20, '');
    }

    updateScore(score)
    {
        this.score = score;
        this.scoreText.setText(score + ' drops');
    }

    updateCombo(text)
    {
        this.comboText.setText(text);
    }
}