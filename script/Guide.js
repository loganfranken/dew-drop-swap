import TagText from 'phaser3-rex-plugins/plugins/tagtext.js';
import TextTyping from 'phaser3-rex-plugins/plugins/texttyping.js';

export default class {

    constructor(x, y, script)
    {
        this.x = x;
        this.y = y;
        this.script = script;

        this.queuedMessages = null;
        this.isPaused = false;
        this.isBlockingGameplay = false;

        this.endDialogueMarkerGraphics = null;
    }

    create(context)
    {
        const self = this;

        const speechBubbleWidth = 500;
        const speechBubbleHeight = 100;

        const endDialogueMarkerRadius = 10;
        
        const characterWidth = 100;
        const characterHeight = 500;

        // Speech Bubble
        const speechBubbleGraphics = context.add.graphics({ fillStyle: { color: 0xffffff } });
        const speechBubble = new Phaser.Geom.Rectangle(this.x, this.y, speechBubbleWidth, speechBubbleHeight);
        speechBubbleGraphics.fillRectShape(speechBubble);

        // End Dialogue Marker
        this.endDialogueMarkerGraphics = context.add.graphics({ fillStyle: { color: 0xcccccc } });
        this.hideEndDialogueMarker();
        const endDialogueMarker = new Phaser.Geom.Circle(
            this.x + speechBubbleWidth - endDialogueMarkerRadius,
            this.y + speechBubbleHeight - endDialogueMarkerRadius,
            endDialogueMarkerRadius);
        this.endDialogueMarkerGraphics.fillCircleShape(endDialogueMarker);

        context.tweens.add({
            targets: this.endDialogueMarkerGraphics,
            alpha: 0,
            duration: 500,
            repeat: -1,
            yoyo: true
        });

        // Speech Bubble Text
        const speechBubbleTextStyle = {
            color: '#000',
            wrap: {
                mode: 'word',
                width: speechBubbleWidth
            },
            tags: {
                exclamation: {
                    fontStyle: 'bold'
                }
            }
        };
        
        this.speechBubbleText = new TagText(context, this.x, this.y, '', speechBubbleTextStyle);
        context.add.existing(this.speechBubbleText);

        // Speech Bubble Text Typing
        this.speechBubbleTextTyping = new TextTyping(this.speechBubbleText, { speed: 30 }); 
        this.speechBubbleTextTyping.on('complete', () => { self.onMessageComplete.call(self) });

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

        if(self.speechBubbleTextTyping.isTyping)
        {
            return;
        }

        self.isBlockingGameplay = true;
        self.progressDialogue();
    }

    onMessageComplete()
    {
        this.showEndDialogueMarker();
        if(this.queuedMessages.length === 0)
        {
            this.isBlockingGameplay = false;
            return;
        }
    }

    displayTileMatchMessage(context, data)
    {
        const messages = this.script.getDisplayTileMatchMessages(data);
        this.queueMessages(context, messages);
    }

    progressDialogue()
    {
        this.hideEndDialogueMarker();
        if(this.queuedMessages.length > 0)
        {
            const message = this.convertDialogToTagText(this.queuedMessages.shift());
            this.speechBubbleTextTyping.start(message);
        }
    }

    showEndDialogueMarker()
    {
        this.endDialogueMarkerGraphics.setVisible(true);
    }

    hideEndDialogueMarker()
    {
        this.endDialogueMarkerGraphics.setVisible(false);
    }

    convertDialogToTagText(input)
    {
        const styles = [
            { token: '*', className: 'exclamation' },
            { token: '_', className: 'underline'}
        ];    

        let output = '';
        let currClass = '';
    
        for(let i=0; i<input.length; i++)
        {
            const currChar = input[i];
            const isStyleToken = styles.some(style => style.token === currChar);
    
            // If the first character isn't a style token, then
            // we need to open a "normal" class tag
            if(i === 0 && !isStyleToken)
            {
                output += '<class="normal">';
                currClass = 'normal';
            }
    
            // If the last character is a style token, we ignore it
            // since we'll always end with a closing class tag anyway
            if(i === input.length - 1 && isStyleToken)
            {
                continue;
            }
    
            if(isStyleToken)
            {
                const targetStyle = styles.find(style => style.token === currChar);
    
                // If we've encountered a token of the class we already have open,
                // that means we need to close the class
                if(currClass === targetStyle.className)
                {
                    output += '</class>';
                    output += '<class="normal">';
                    currClass = 'normal';
                }
    
                // Otherwise, we need to close the existing the class and
                // open the new class
                else
                {
                    if(i !== 0)
                    {
                        output += '</class>';
                    }
    
                    output += `<class="${targetStyle.className}">`;
                    currClass = targetStyle.className;
                }
            }
            else
            {
                output += input[i];
            }
        }
    
        output += '</class>';
        return output;
    }
}