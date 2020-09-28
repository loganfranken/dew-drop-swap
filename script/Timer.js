import EventEmitter from './EventEmitter';
import FontStyleManifest from './FontStyleManifest';

export default class extends EventEmitter {

    constructor(x, y, ticks)
    {
        super();

        this.x = x;
        this.y = y;
        this.text = null;
        this.ticks = ticks;
        this.isPaused = true;
    }

    create(context)
    {
        // Icon
        context.add.image(this.x + 15, this.y + 15, 'icon_timer').setAlpha(0.7);

        // Text
        this.text = context.add.text(this.x + 40, this.y, this.getTimeOutput(this.ticks), FontStyleManifest.Default);
        
        this.tick();
        context.time.addEvent({ delay: 1000, callback: this.tick, callbackScope: this, loop: true })
    }

    tick()
    {
        if(this.ticks <= 0 || this.isPaused)
        {
            return;
        }

        this.emit('tick');
        this.ticks--;

        this.text.setText(this.getTimeOutput(this.ticks));
    }

    start()
    {
        this.isPaused = false;
    }

    stop()
    {
        this.isPaused = true;
    }

    getTimeOutput(input)
    {
        const minutes = Math.floor(input / 60);

        let seconds = (input % 60);
        if(seconds < 10)
        {
            seconds = '0' + seconds;
        }

        return `${minutes}:${seconds}`;
    }
}