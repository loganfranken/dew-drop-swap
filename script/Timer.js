export default class {

    constructor(x, y, seconds)
    {
        this.x = x;
        this.y = y;
        this.text = null;
        this.seconds = seconds;
    }

    create(context)
    {
        this.text = context.add.text(this.x, this.y, this.score);
        
        this.tick();
        context.time.addEvent({ delay: 1000, callback: this.tick, callbackScope: this, loop: true })
    }

    tick()
    {
        if(this.seconds <= 0)
        {
            return;
        }

        this.seconds--;

        // Display the remaining time
        const minutes = Math.floor(this.seconds / 60);

        let seconds = (this.seconds % 60);
        if(seconds < 10)
        {
            seconds = '0' + seconds;
        }

        this.text.setText(`${minutes}:${seconds}`);
    }
}