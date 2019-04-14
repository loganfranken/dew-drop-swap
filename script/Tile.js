export default class {

    constructor(tileType, x, y)
    {
        this.tileType = tileType;
        this.x = x;
        this.y = y;
    }

    create(context)
    {
        context.add.image(this.x, this.y, this.tileType.imageKey);
    }

}