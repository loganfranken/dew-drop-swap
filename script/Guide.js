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

        this.hideEndDialogueMarkerOnMessageComplete = false;

        this.endDialogueMarkerGraphics = null;

        this.character = null;
        this.characterWidth = null;
        this.characterExpression = null;

        this.speechBubbleGraphics = null;
        this.speechBubbleText = null;

        this.expressions = {};
        this.expressions.default = { faceY: -90, bodyAngle: 0 };
        this.expressions.surprise = { faceY: -105, bodyAngle: -4 };
        this.expressions.sadness = { faceY: -80, bodyAngle: 5 };
        this.expressions.despair = { faceY: -70, bodyAngle: 7 };
        this.expressions.glee = { faceY: -100, bodyAngle: -4 };
        this.expressions.nervous = { faceY: -85, bodyAngle: 0 };
        this.expressions.confused = { faceY: -100, bodyAngle: -2 };
        this.expressions.neutral = { faceY: -90, bodyAngle: 0 };
        this.expressions.amused = { faceY: -95, bodyAngle: 0 };
        this.expressions.thoughtful = { faceY: -70, bodyAngle: 0 };

        this.isTalking = false;
    }

    create(context)
    {
        const self = this;

        const speechBubbleWidth = 760;
        const speechBubbleHeight = 130;

        const endDialogueMarkerRadius = 10;
        
        this.characterWidth = 250;

        const speechBubbleIntroOffset = 40;

        // Speech Bubble
        this.speechBubbleGraphics = context.add.graphics({ fillStyle: { color: 0xffffff } })
        
        if(this.isIntro)
        {
            this.speechBubbleGraphics.setAlpha(0);
        }
        
        const speechBubbleGraphicsY = this.isIntro ? this.y - speechBubbleIntroOffset : this.y;
        const speechBubbleGraphicsTriangleY1 = this.isIntro ? this.y + speechBubbleHeight + 20 - speechBubbleIntroOffset : this.y + speechBubbleHeight + 20;
        const speechBubbleGraphicsTriangleY2 = this.isIntro ? this.y + speechBubbleHeight - speechBubbleIntroOffset : this.y + speechBubbleHeight;

        this.speechBubbleGraphics.setDepth(1);
        this.speechBubbleGraphics.fillRoundedRect(this.x, speechBubbleGraphicsY, speechBubbleWidth, speechBubbleHeight, 10);
        this.speechBubbleGraphics.fillTriangle(
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

        const characterX = (this.isIntro) ? (this.x - this.characterWidth) : (this.x + this.characterWidth/2);
        this.character = context.add.container(characterX, this.y + speechBubbleHeight + 230);

        // Character
        const characterImage = context.add.image(0, 0, 'guide_character');
        this.character.add(characterImage);

        // Expression
        const startingExpression = this.isIntro ? 'expression_surprise' : 'expression_default';
        const characterExpressionY = this.isIntro ? this.expressions.surprise.faceY : this.expressions.default.faceY;
        this.characterExpression = context.add.sprite(-10, characterExpressionY, startingExpression);
        this.character.add(this.characterExpression);

        const blinkOffset = 15;
        context.tweens.addCounter({
            duration: 100,
            yoyo: true,
            loop: -1,
            loopDelay: 2000,
            from: 0,
            to: 1,
            onUpdate: (tween) => {
                const currOffset = blinkOffset * tween.getValue();
                this.characterExpression.setCrop(0, currOffset, self.characterExpression.width, self.characterExpression.height);
            }
        });

        // Intro Timeline
        const introTimeline = context.tweens.createTimeline();

        if(this.isIntro)
        {
            // Slide in the character
            introTimeline.add({
                delay: 200,
                targets: this.character,
                x: (this.x + this.characterWidth/2),
                duration: 400,
                angle: 15,
                ease: 'Power1'
            });

            // Sway backwards
            introTimeline.add({
                targets: this.character,
                duration: 400,
                angle: -7,
                ease: 'Power1'
            });

            // Sway into position
            introTimeline.add({
                targets: this.character,
                duration: 400,
                angle: 0,
                ease: 'Power1'
            });

            // Speech Bubble Intro Animation
            introTimeline.add({
                offset: '-=300',
                targets: this.speechBubbleGraphics,
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
                targets: this.speechBubbleGraphics,
                duration: 100,
                onComplete: () => {
                    this.emit('ready');
                }
            }); 
        }

        introTimeline.play();
    }

    displayMessage(message, hideEndDialogueMarkerOnMessageComplete)
    {
        this.isTalking = true;
        this.hideEndDialogueMarker();
        const convMessage = this.convertDialogToTagText(message);
        this.speechBubbleTextTyping.start(convMessage);
        this.hideEndDialogueMarkerOnMessageComplete = hideEndDialogueMarkerOnMessageComplete;
    }

    messageCompleted()
    {
        this.isTalking = false;
        if(!this.hideEndDialogueMarkerOnMessageComplete)
        {
            this.showEndDialogueMarker();
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

    updateExpression(key, context)
    {
        this.characterExpression.setTexture('expression_' + key);
        this.characterExpression.isCropped = false;

        const expressionInfo = this.expressions[key];

        context.tweens.add({
            targets: this.characterExpression,
            y: expressionInfo.faceY,
            duration: 200,
            ease: 'Power1'
        });

        context.tweens.add({
            targets: this.character,
            angle: expressionInfo.bodyAngle,
            duration: 600,
            ease: 'Power2'
        });
    }

    hide(context)
    {
        context.tweens.add({
            targets: this.character,
            x: (this.x - this.characterWidth),
            duration: 800,
            angle: -15,
            ease: 'Power1'
        });

        context.tweens.add({
            targets: [ this.speechBubbleGraphics, this.speechBubbleText ],
            alpha: 0,
            duration: 200
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