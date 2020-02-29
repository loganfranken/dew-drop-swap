export default class extends Phaser.Scene {

    constructor()
    {
        super('RoundTransitionScene');

        this.nextLevel = 0;
    }

    init(data)
    {
        this.nextLevel = data.nextLevel;
    }

    create()
    {
        const self = this;

        // Title
        this.add.text(50, 50, `Round ${self.nextLevel}`);

        this.time.addEvent({ delay: 1000, callback: function() { self.scene.start('RoundScene', { level: self.nextLevel }) }, callbackScope: this })
    }
    
}