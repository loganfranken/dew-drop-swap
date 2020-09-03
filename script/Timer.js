import FontStyleManifest from './FontStyleManifest';

export default class {

    constructor(x, y, seconds)
    {
        this.x = x;
        this.y = y;
        this.text = null;
        this.seconds = seconds;
        this.isPaused = true;
    }

    create(context)
    {
        // Icon
        context.add.image(this.x + 15, this.y + 15, 'icon_timer').setAlpha(0.7);

        // Text
        this.text = context.add.text(this.x + 40, this.y, this.score, FontStyleManifest.Default);
        
        this.tick();
        context.time.addEvent({ delay: 1000, callback: this.tick, callbackScope: this, loop: true })
    }

    tick()
    {
        if(this.seconds <= 0 || this.isPaused)
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

    start()
    {
        this.isPaused = false;
    }
}