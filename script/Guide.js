export default class {

    constructor(x, y)
    {
        this.x = x;
        this.y = y;

        this.messageTimer = null;
        this.currMessageIndex = 0;
        this.queuedMessages = null;
    }

    create(context)
    {
        const self = this;

        const speechBubbleWidth = 500;
        const speechBubbleHeight = 100;
        
        const characterWidth = 100;
        const characterHeight = 500;

        // Speech Bubble
        const speechBubbleGraphics = context.add.graphics({ fillStyle: { color: 0xffffff } });
        const speechBubble = new Phaser.Geom.Rectangle(this.x, this.y, speechBubbleWidth, speechBubbleHeight);
        speechBubbleGraphics.fillRectShape(speechBubble);

        context.input.on('pointerdown', (pointer) => {
            if(speechBubble.contains(pointer.x, pointer.y))
            {
                self.messageTimer.paused = false;
            }
        });

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

    queueMessages(context, messages)
    {
        const self = this;
        
        if(self.messageTimer != null)
        {
            return new Promise((resolve, reject) => { resolve(); });
        }

        this.queuedMessages = messages;
        return new Promise((resolve, reject) => {

            self.messageTimer = context.time.addEvent({
                delay: 50,
                callback: () => {
                    if(self.queuedMessages.length === 0)
                    {
                        self.messageTimer.remove();
                        self.messageTimer = null;
                        resolve();
                        return;
                    }
    
                    self.currMessageIndex++;

                    const currMessage = self.queuedMessages[0];
    
                    if(self.currMessageIndex > currMessage.length)
                    {
                        self.currMessageIndex = 0;
                        self.queuedMessages.shift();
                        self.messageTimer.paused = true;
                        return;
                    }
    
                    const message = currMessage.slice(0, self.currMessageIndex);
                    self.speechBubbleText.setText(message);
                },
                callbackScope: this,
                loop: true
            });

        });
    }

    updateMessage(text)
    {
        this.speechBubbleText.setText(text);
    }
}