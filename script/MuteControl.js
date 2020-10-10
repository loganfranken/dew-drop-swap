export default class {

    constructor(x, y)
    {
        this.x = x;
        this.y = y;

        this.muteIcon = null;

        this.isMuted = false;
    }

    create(context)
    {
        // Base Icon
        const baseIcon = context.add.image(this.x, this.y, 'icon_audio');
        baseIcon.setAlpha(0.7);
        baseIcon.setInteractive({ cursor: 'pointer' });

        // Mute Icon
        this.muteIcon = context.add.image(this.x, this.y, 'icon_audio_mute');
        this.muteIcon.setAlpha(0);

        const self = this;
        baseIcon.on('pointerdown', () => {
            self.toggleMute(context);
        });

        if(context.sound.mute)
        {
            this.isMuted = true;
            this.muteIcon.setAlpha(0.7);
        }
    }

    toggleMute(context)
    {
        if(this.isMuted)
        {
            context.sound.mute = false;
            this.isMuted = false;
            context.tweens.add({
                targets: this.muteIcon,
                alpha: 0,
                duration: 100
            });
        }
        else
        {
            context.sound.mute = true;
            this.isMuted = true;
            context.tweens.add({
                targets: this.muteIcon,
                alpha: 0.7,
                duration: 100
            });
        }
    }
}