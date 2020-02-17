export default class {

    constructor(x, y, script)
    {
        this.x = x;
        this.y = y;
        this.script = script;

        this.messageTimer = null;
        this.currMessageIndex = 0;
        this.queuedMessages = null;
        this.isBlockingGameplay = false;
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

        // Speech Bubble Text
        const speechBubbleTextStyle = { color: '#000', wordWrap: { width: speechBubbleWidth, useAdvancedWrap: true } };
        this.speechBubbleText = context.add.text(this.x + 5, this.y + 5, '', speechBubbleTextStyle);

        // Character
        const characterGraphics = context.add.graphics({ fillStyle: { color: 0xff0000 } });
        const character = new Phaser.Geom.Rectangle(
            this.x + speechBubbleWidth - characterWidth,
            this.y + speechBubbleHeight + 20,
            characterWidth,
            characterHeight);
        characterGraphics.fillRectShape(character);

        self.queueMessages(context, this.script.introMessages);
    }

    queueMessages(context, messages)
    {
        if(!messages)
        {
            return;
        }

        const self = this;

        if(self.queuedMessages === null)
        {
            self.queuedMessages = [];
        }

        self.queuedMessages.push(...messages);

        if(self.messageTimer != null)
        {
            return;
        }

        self.isBlockingGameplay = true;
        self.messageTimer = context.time.addEvent({
            delay: 50,
            callback: () => {
                self.currMessageIndex++;

                const currMessage = self.queuedMessages[0];
                if(self.currMessageIndex > currMessage.length)
                {
                    self.currMessageIndex = 0;
                    self.queuedMessages.shift();
                    self.messageTimer.paused = true;

                    if(self.queuedMessages.length === 0)
                    {
                        self.isBlockingGameplay = false;
                        self.messageTimer.remove();
                        self.messageTimer = null;
                        return;
                    }

                    return;
                }

                const message = currMessage.slice(0, self.currMessageIndex);
                self.speechBubbleText.setText(message);
            },
            callbackScope: this,
            loop: true
        });
    }

    displayTileMatchMessage(context, data)
    {
        const messages = this.script.getDisplayTileMatchMessages(data);
        this.queueMessages(context, messages);
    }

    progressDialogue()
    {
        this.messageTimer.paused = false;
    }
}