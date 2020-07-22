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

        const speechBubbleWidth = 760;
        const speechBubbleHeight = 130;

        const endDialogueMarkerRadius = 10;
        
        const characterWidth = 250;
        const characterHeight = 500;

        const speechBubbleIntroOffset = 40;

        // Speech Bubble
        const speechBubbleGraphics = context.add.graphics({ fillStyle: { color: 0xffffff } }).setAlpha(0);
        speechBubbleGraphics.fillRoundedRect(this.x, this.y - speechBubbleIntroOffset, speechBubbleWidth, speechBubbleHeight, 10);
        speechBubbleGraphics.fillTriangle(
            this.x + 120, this.y + speechBubbleHeight + 20 - speechBubbleIntroOffset,
            this.x + 105, this.y + speechBubbleHeight - speechBubbleIntroOffset,
            this.x + 135, this.y + speechBubbleHeight - speechBubbleIntroOffset
        );

        // End Dialogue Marker
        this.endDialogueMarkerGraphics = context.add.graphics({ fillStyle: { color: 0xcccccc } });
        this.hideEndDialogueMarker();
        const endDialogueMarker = new Phaser.Geom.Circle(
            this.x + speechBubbleWidth - endDialogueMarkerRadius - 15,
            this.y + speechBubbleHeight - endDialogueMarkerRadius - 15,
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
            fontFamily: '"Fredoka One"',
            fontSize: '24px',
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
        
        this.speechBubbleText = new TagText(context, this.x + 15, this.y + 15, '', speechBubbleTextStyle);
        context.add.existing(this.speechBubbleText);

        // Speech Bubble Text Typing
        this.speechBubbleTextTyping = new TextTyping(this.speechBubbleText, { speed: 30 }); 
        this.speechBubbleTextTyping.on('complete', () => { self.onMessageComplete.call(self) });

        // Character
        context.add.image(this.x + (characterWidth/2), this.y + speechBubbleHeight + 230, 'guide_character');

        // Speech Bubble Intro Animation
        context.tweens.add({
            targets: speechBubbleGraphics,
            props: {
                y: { value: `+=${speechBubbleIntroOffset}`, duration: 500, ease: 'Bounce.easeOut' },
                alpha: { value: 1, duration: 300, ease: 'Linear' }
            },
            onComplete: () => {
                self.queueMessages(context, this.script.introMessages);
            }
        });

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

    displayGameOverMessage(context)
    {
        const messages = this.script.getGameOverMessages();

        // Push in a placeholder message to force players to confirm the last
        // message in the "Game Over" queue
        messages.push(' ');

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