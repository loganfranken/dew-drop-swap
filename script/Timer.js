import EventEmitter from './EventEmitter';
import FontStyleManifest from './FontStyleManifest';

export default class extends EventEmitter {

    constructor(x, y, ticks)
    {
        super();

        this.x = x;
        this.y = y;

        this.text = null;
        this.icon = null;

        this.warningTweens = null;
        this.warningIcon = null;
        this.warningSound = null;
        this.timerRunOutSound = null;

        this.ticks = ticks;
        this.isPaused = true;
        this.isDisplayingWarning = false;
    }

    create(context)
    {
        // Icon
        this.icon = context.add.image(this.x + 15, this.y + 15, 'icon_timer').setAlpha(0.7);

        // Warning Icon
        this.warningIcon = context.add.image(this.x + 15, this.y + 15, 'icon_timer_warning').setAlpha(0);
        
        // Warning Sound
        this.warningSound = context.sound.add('warning_tick');

        // Timer Run Out Sound
        this.timerRunOutSound = context.sound.add('timer_run_out');

        // Text
        this.text = context.add.text(this.x + 40, this.y, this.getTimeOutput(this.ticks), FontStyleManifest.Default);
        
        this.tick(context);
        
        const self = this;
        context.time.addEvent({ delay: 1000, callback: () => { self.tick(context); }, callbackScope: this, loop: true })
    }

    tick(context)
    {
        if(this.ticks <= 0 || this.isPaused)
        {
            return;
        }

        if(this.ticks <= 30 && !this.isDisplayingWarning)
        {
            this.displayWarning(context);
        }

        if(this.ticks <= 10)
        {
            this.warningSound.play();
        }

        if(this.ticks === 1)
        {
            this.timerRunOutSound.play();
            this.warningTweens.forEach(tween => {
                tween.stop(0);
            })
        }

        this.emit('tick');
        this.ticks--;

        this.output();
    }

    update(ticks)
    {
        this.ticks = ticks;
        this.output();
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

    output()
    {
        this.text.setText(this.getTimeOutput(this.ticks));
    }

    displayWarning(context)
    {
        this.isDisplayingWarning = true;

        this.warningTweens = [];

        this.warningTweens.push(context.tweens.add({
            targets: [ this.icon, this.warningIcon ],
            angle: -60,
            duration: 400,
            yoyo: true,
            repeat: -1
        }));

        this.warningTweens.push(context.tweens.add({
            targets: this.warningIcon,
            alpha: 0.6,
            duration: 300,
            repeatDelay: 100,
            yoyo: true,
            repeat: -1
        }));
    }
}