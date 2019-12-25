export default class {

    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.speechBubbleText = null;
    }

    create(context)
    {
        const speechBubbleWidth = 500;
        const speechBubbleHeight = 100;
        
        const characterWidth = 100;
        const characterHeight = 500;

        // Speech Bubble
        const speechBubbleGraphics = context.add.graphics({ fillStyle: { color: 0xffffff } });
        const speechBubble = new Phaser.Geom.Rectangle(this.x, this.y, speechBubbleWidth, speechBubbleHeight);
        speechBubbleGraphics.fillRectShape(speechBubble);

        // Speech Bubble Text
        this.speechBubbleText = context.add.text(this.x + 5, this.y + 5, '', { color: '#000' });

        // Character
        const characterGraphics = context.add.graphics({ fillStyle: { color: 0xff0000 } });
        const character = new Phaser.Geom.Rectangle(
            this.x + speechBubbleWidth - characterWidth,
            this.y + speechBubbleHeight + 20,
            characterWidth,
            characterHeight);
        characterGraphics.fillRectShape(character);
    }

    updateMessage(text)
    {
        this.speechBubbleText.setText(text);
    }
}