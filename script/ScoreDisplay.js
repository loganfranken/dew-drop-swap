export default class {

    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.text = null;
        this.score = 0;
    }

    create(context)
    {
        this.text = context.add.text(this.x, this.y, this.score);
    }

    updateScore(score)
    {
        this.score = score;
        this.text.setText(score);
    }
}