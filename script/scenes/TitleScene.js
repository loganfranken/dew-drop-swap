export default class extends Phaser.Scene {

    constructor()
    {
        super('TitleScene');
    }

    create()
    {
        this.add.text(50, 50, 'Match Three!');
        this.time.addEvent({ delay: 1000, callback: function() { this.scene.start('RoundScene') }, callbackScope: this })
    }
    
}