import EventEmitter from './EventEmitter';
import FontStyleManifest from './FontStyleManifest';
import TagText from 'phaser3-rex-plugins/plugins/tagtext.js';
import TextTyping from 'phaser3-rex-plugins/plugins/texttyping.js';

export default class extends EventEmitter {

    constructor(x, y, isIntro)
    {
        super();

        this.x = x;
        this.y = y;
        this.isIntro = isIntro;

        this.queuedActions = null;
        this.isPaused = false;
        this.isBlockingGameplay = false;

        this.endDialogueMarkerGraphics = null;
        this.characterExpression = null;

        this.expressions = {};
        this.expressions.default = { y: -90 };
        this.expressions.surprise = { y: -105 };
        this.expressions.sadness = { y: -80 };
        this.expressions.despair = { y: -70 };
        this.expressions.glee = { y: -100 };
        this.expressions.nervous = { y: -85 };
        this.expressions.confused = { y: -100 };
        this.expressions.neutral = { y: -90 };
        this.expressions.amused = { y: -95 };
        this.expressions.thoughtful = { y: -70 };
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
        const speechBubbleGraphics = context.add.graphics({ fillStyle: { color: 0xffffff } })
        
        if(this.isIntro)
        {
            speechBubbleGraphics.setAlpha(0);
        }
        
        const speechBubbleGraphicsY = this.isIntro ? this.y - speechBubbleIntroOffset : this.y;
        const speechBubbleGraphicsTriangleY1 = this.isIntro ? this.y + speechBubbleHeight + 20 - speechBubbleIntroOffset : this.y + speechBubbleHeight + 20;
        const speechBubbleGraphicsTriangleY2 = this.isIntro ? this.y + speechBubbleHeight - speechBubbleIntroOffset : this.y + speechBubbleHeight;

        speechBubbleGraphics.setDepth(1);
        speechBubbleGraphics.fillRoundedRect(this.x, speechBubbleGraphicsY, speechBubbleWidth, speechBubbleHeight, 10);
        speechBubbleGraphics.fillTriangle(
            this.x + 120, speechBubbleGraphicsTriangleY1,
            this.x + 105, speechBubbleGraphicsTriangleY2,
            this.x + 135, speechBubbleGraphicsTriangleY2
        );

        // End Dialogue Marker
        this.endDialogueMarkerGraphics = context.add.graphics({ fillStyle: { color: 0xcccccc } });
        this.endDialogueMarkerGraphics.setDepth(1);
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
        const speechBubbleTextStyle = FontStyleManifest.Default;
        speechBubbleTextStyle.wrap = {
            mode: 'word',
            width: speechBubbleWidth - 30
        };
        speechBubbleTextStyle.tags = {
            exclamation: {
                fontStyle: 'bold'
            }
        };
        
        this.speechBubbleText = new TagText(context, this.x + 15, this.y + 15, '', speechBubbleTextStyle);
        this.speechBubbleText.setDepth(1);
        context.add.existing(this.speechBubbleText);

        // Speech Bubble Text Typing
        this.speechBubbleTextTyping = new TextTyping(this.speechBubbleText, { speed: 30 }); 
        this.speechBubbleTextTyping.on('complete', () => { self.messageCompleted.call(self) });

        const characterX = (this.isIntro) ? (this.x - characterWidth) : (this.x + characterWidth/2);
        const character = context.add.container(characterX, this.y + speechBubbleHeight + 230);

        // Character
        const characterImage = context.add.image(0, 0, 'guide_character');
        character.add(characterImage);

        // Expression
        const startingExpression = this.isIntro ? 'expression_surprise' : 'expression_default';
        const characterExpressionY = this.isIntro ? this.expressions.surprise.y : this.expressions.default.y;
        this.characterExpression = context.add.sprite(-10, characterExpressionY, startingExpression);
        character.add(this.characterExpression);

        // Intro Timeline
        const introTimeline = context.tweens.createTimeline();

        if(this.isIntro)
        {
            // Slide in the character
            introTimeline.add({
                delay: 200,
                targets: character,
                x: (this.x + characterWidth/2),
                duration: 400,
                angle: 15,
                ease: 'Power1'
            });

            // Sway backwards
            introTimeline.add({
                targets: character,
                duration: 400,
                angle: -7,
                ease: 'Power1'
            });

            // Sway into position
            introTimeline.add({
                targets: character,
                duration: 400,
                angle: 0,
                ease: 'Power1'
            });

            // Speech Bubble Intro Animation
            introTimeline.add({
                offset: '-=300',
                targets: speechBubbleGraphics,
                props: {
                    y: { value: `+=${speechBubbleIntroOffset}`, duration: 500, ease: 'Bounce.easeOut' },
                    alpha: { value: 1, duration: 300, ease: 'Linear' }
                },
                onComplete: () => {
                    this.emit('ready');
                }
            }); 
        }
        else
        {
            introTimeline.add({
                targets: speechBubbleGraphics,
                duration: 100,
                onComplete: () => {
                    this.emit('ready');
                }
            }); 
        }

        introTimeline.play();
    }

    displayMessage(message)
    {
        this.hideEndDialogueMarker();
        const convMessage = this.convertDialogToTagText(message);
        this.speechBubbleTextTyping.start(convMessage);
    }

    messageCompleted()
    {
        this.showEndDialogueMarker();
    }

    showEndDialogueMarker()
    {
        this.endDialogueMarkerGraphics.setVisible(true);
    }

    hideEndDialogueMarker()
    {
        this.endDialogueMarkerGraphics.setVisible(false);
    }

    updateExpression(key, context)
    {
        this.characterExpression.setTexture('expression_' + key);

        const expressionInfo = this.expressions[key];

        context.tweens.add({
            targets: this.characterExpression,
            y: expressionInfo.y,
            duration: 200,
            ease: 'Power1'
        });
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