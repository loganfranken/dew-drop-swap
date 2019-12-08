export default class extends Phaser.Scene {

    constructor()
    {
        super('GameOverScene');

        this.finalScore = 0;
    }

    init(data)
    {
        this.finalScore = data.score;
    }

    create()
    {
        this.add.text(50, 50, 'Game Over!');
        this.add.text(50, 100, `Final Score: ${this.finalScore}`);
        this.time.addEvent({ delay: 1000, callback: function() { this.scene.start('TitleScene') }, callbackScope: this })
    }
    
}