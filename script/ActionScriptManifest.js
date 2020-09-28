import TileGenerationBehavior from './TileGenerationBehavior';

export default {

    getScript(level)
    {
        switch(level)
        {
            // Level 0 (Intro)
            case 0:
                
                return [

                    // Script
                    `*Oh, doozle, you made it!* You're here! (Click or tap anywhere!)`,
                    { do: 'updateGuideExpression', value: 'sadness' },
                    `The Dew Drop Kingdom is in trouble!`,
                    { do: 'updateGuideExpression', value: 'despair' },
                    `We lost all of our dew drops and now we'll starve!`,
                    { do: 'updateGuideExpression', value: 'glee' },
                    { do: 'dropTiles' },
                    `But you can help us by collecting as many dew drops as you can!`,
                    { do: 'updateGuideExpression', value: 'default' },
                    "If you match three or more dew drops of the same color, we can collect them!",
                    { do: 'unblockTileGrid' },
                    "To make a match, select two dew drops and swap their places!",

                    // Events
                    {
                        on: 'match',
                        filter: (state) => { return state.matches === 1; },
                        actions: [
                            { do: 'updateGuideExpression', value: 'glee' },
                            "You got it! That's it!",
                            { do: 'updateGuideExpression', value: 'default' },
                            "See if you can collect *100 dew drops*!"
                        ]
                    },

                    {
                        on: 'match',
                        filter: (state) => { return state.matches === 5; },
                        actions: [
                            { do: 'updateGuideExpression', value: 'glee' },
                            "*Wow!* Look at you go!",
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'win',
                        actions: [
                            { do: 'endLevel' }
                        ]
                    }

                ];

            // Level 1 (Timer Intro)
            case 1:

                return [
                    { do: 'updateGuideExpression', value: 'glee' },
                    `*Oh, doozle!* You're so good at this!`,
                    { do: 'updateGuideExpression', value: 'nervous' },
                    `But, we'll have to hurry this time!`,
                    { do: 'dropTiles' },
                    `We only have two minutes before the sun dries up all the dew drops!`,
                    { do: 'updateGuideExpression', value: 'default' },
                    `Collect at least *200 dew drops* in *two minutes*!`,
                    { do: 'unblockTileGrid' },
                    { do: 'startTimer' },

                    // Events
                    {
                        on: 'gameOver',
                        actions: [
                            { do: 'blockTileGrid' },
                            { do: 'updateGuideExpression', value: 'confused' },
                            `Uhh?`,
                            { do: 'updateGuideExpression', value: 'neutral' },
                            `I think there's been a mix-up.`,
                            { do: 'updateGuideExpression', value: 'confused' },
                            `Did you get the wrong script?`,
                            { do: 'updateGuideExpression', value: 'neutral' },
                            `You're supposed to win this time.`,
                            `Well, whatever, I'm sure we can just fix it up in post.`,
                            `Let's just move onto the next round.`,
                            { do: 'endLevel' }
                        ]
                    },

                    {
                        on: 'win',
                        actions: [
                            { do: 'endLevel' }
                        ]
                    }
                ];

            // Level 2 (Breaking the Fourth Wall)
            case 2:

                return [
                    { do: 'updateGuideExpression', value: 'glee' },
                    `Wow, we're so proud of you!`,
                    `How did you get so goo...`,
                    { do: 'updateGuideExpression', value: 'nervous' },
                    `...`,
                    { do: 'updateGuideExpression', value: 'surprise' },
                    `*Eezle!* That sun is hot!`,
                    `You're going to have to move even quicker this time!`,
                    { do: 'dropTiles' },
                    { do: 'updateGuideExpression', value: 'default' },
                    `But we know you can do it!`,
                    `This round you'll only have *30 seconds* to collect at least *300 dew drops*!`,
                    { do: 'unblockTileGrid' },
                    { do: 'startTimer' },

                    // Events
                    {
                        on: 'gameOver',
                        actions: [
                            { do: 'blockTileGrid' },
                            { do: 'updateGuideExpression', value: 'confused' },
                            `Wait, wait, sorry, hold on.`,
                            `We're not doing the *\"Lose in a Panic\"* scenario today.`,
                            { do: 'updateGuideExpression', value: 'neutral' },
                            `So sorry about that.`,
                            { do: 'updateGuideExpression', value: 'amused' },
                            `You've been really great so far, honestly.`,
                            { do: 'updateGuideExpression', value: 'neutral' },
                            `Let's just go ahead and take it from the top.`,
                            { do: 'endLevel' }
                        ]
                    },

                    {
                        on: 'win',
                        actions: [
                            { do: 'updateGuideExpression', value: 'confused' },
                            `Wait, is that...`,
                            { do: 'updateGuideExpression', value: 'neutral' },
                            `No, I think you were supposed to lose here.`,
                            { do: 'updateGuideExpression', value: 'thoughtful' },
                            `Yeah, hmm. This was the *\"Lose in a Panic\"* scenario.`,
                            { do: 'updateGuideExpression', value: 'neutral' },
                            `You know what, that's fine.`,
                            { do: 'updateGuideExpression', value: 'amused' },
                            `Let's roll with it.`,
                            { do: 'updateGuideExpression', value: 'neutral' },
                            `We'll just move to the next round.`,
                            { do: 'endLevel' }
                        ]
                    }
                ];

            // Level 3 (Easy Win)
            case 3:

                return [
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `Alright, I think we've got everything figured out.`,
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Okay, for this next round, let me set you up:`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    "Remember, you've been winning the last few rounds and you're gaining confidence.",
                    { do: 'updateGuideExpression', value: 'amused' },
                    "In this round, it's going to be easy for you to get combos.",
                    "So the idea here is that you're going to get a little *too* confident, right?",
                    { do: 'updateGuideExpression', value: 'confused' },
                    "Like a little full of yourself, alright?",
                    { do: 'updateGuideExpression', value: 'amused' },
                    "Okay, great! Let's do this:",
                    { do: 'updateGuideExpression', value: 'neutral' },
                    "...",
                    "...",
                    "...",
                    { do: 'updateGuideExpression', value: 'default' },
                    "*Oh doozle woozle!*",
                    { do: 'updateGuideExpression', value: 'surprise' },
                    "You're so amazing!",
                    { do: 'updateGuideExpression', value: 'default' },
                    { do: 'dropTiles' },
                    "You have *two minutes* again, but this time you'll have to collect *300 dew drops*.",
                    { do: 'updateGuideExpression', value: 'confused' },
                    "Can you do it?",
                    { do: 'updateGuideExpression', value: 'default' },
                    { do: 'unblockTileGrid' },
                    { do: 'startTimer' },
                    { do: 'updateGuideExpression', value: 'glee' },
                    `Who am I kidding? Of course you can!`,
                    { do: 'updateGuideExpression', value: 'default' }
                ];

            // Level 4 (Losing Confidence)
            case 4:

                return [
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Okay, okay, great stuff.`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `For this round, you're bringing all of that pride, all of that hubris.`,
                    `And, when the round starts, things are still going your way.`,
                    { do: 'updateGuideExpression', value: 'confused' },
                    `But guess what?`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `Halfway through this round, things start getting a little harder.`,
                    `So this is where we begin to chip away at your pride as the player.`,
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Alright, that's your set up: now let me get into the right headspace.`,
                    { do: 'updateGuideExpression', value: 'thoughtful' },
                    `...oh doozle woo-`,
                    `...no, no, it's doozy-woozy here...`,
                    `...yeah, doozy-woozy, you're our hero...`,
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Alright! Got it!`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `...`,
                    `...`,
                    `...`,
                    { do: 'updateGuideExpression', value: 'surprise' },
                    "*Doozy-woozy!*",
                    { do: 'updateGuideExpression', value: 'glee' },
                    "You're our hero!",
                    { do: 'dropTiles' },
                    { do: 'updateGuideExpression', value: 'default' },
                    "You've done so much for us, but we still need your help!",
                    { do: 'unblockTileGrid' },
                    { do: 'startTimer' },
                    "We need you to collect *400 dew drops* in *two minutes*!",

                    // Events
                    {
                        on: 'halfComplete',
                        actions: [
                            { do: 'updateTileGenerationBehavior', value: TileGenerationBehavior.Hard }
                        ]
                    }
                ];

            // Level 5 (Fall From Grace)
            case 5:

                return [
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Wow, great stuff.`,
                    `I know this is cliche, but it really feels so authentic.`,
                    `It's been great working with you. You really sell it.`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `Okay, here we go, this is a pivotal scene:`,
                    `This round will not go your way at all. At all.`,
                    { do: 'updateGuideExpression', value: 'amused' },
                    `This is your fall from grace.`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `(Ahem)`,
                    { do: 'updateGuideExpression', value: 'thoughtful' },
                    `...`,
                    `...`,
                    `...`,
                    { do: 'updateGuideExpression', value: 'glee' },
                    `*Doozle!*`,
                    `*Woozle!*`,
                    `I can't believe you did it!`,
                    { do: 'updateGuideExpression', value: 'default' },
                    `We've got a bigger challenge ahead, but I know you can do it!`,
                    { do: 'dropTiles' },
                    { do: 'updateGuideExpression', value: 'glee' },
                    `You can do anything!`,
                    { do: 'updateGuideExpression', value: 'default' },
                    { do: 'unblockTileGrid' },
                    { do: 'startTimer' },
                    `We need you to collect *500 dew drops* in *two minutes*!`,

                    // Events
                    {
                        on: 'gameOver',
                        actions: [
                            { do: 'blockTileGrid' },
                            { do: 'updateGuideExpression', value: 'surprise' },
                            `Oh no!`,
                            { do: 'updateGuideExpression', value: 'sadness' },
                            `*Whoopsie whoozle!*`,
                            { do: 'updateGuideExpression', value: 'despair' },
                            `You didn't make it in time!`,
                            { do: 'updateGuideExpression', value: 'sadness' },
                            `It's okay, though!`,
                            { do: 'updateGuideExpression', value: 'nervous' },
                            `It's okay!`,
                            { do: 'updateGuideExpression', value: 'default' },
                            `You can try again!`,
                            { do: 'endLevel' }
                        ]
                    }
                ];

            // Level 6 (Wallowing)
            case 6:

                return [
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `Okay, let's move right into the next scene:`,
                    `Here, you are wallowing, right?`,
                    `You are in the pit of despair and you can't see a way out.`,
                    `This round won't be particularly hard, but you can't seem to find any matches.`,
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Got it?`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `Alright, great: let me find my place here...`,
                    { do: 'updateGuideExpression', value: 'thoughtful' },
                    `...I believed in you, but my faith is faltering...`,
                    `...I'm keeping a brave face, but I'm losing confidence...`,
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Okay, I'm ready!`,
                    `...`,
                    `...`,
                    `...`,
                    { do: 'updateGuideExpression', value: 'default' },
                    `Don't worry, that was a tough one!`,
                    { do: 'dropTiles' },
                    `Let's try again! We believe in you!`,
                    { do: 'updateGuideExpression', value: 'glee' },
                    `We know you can do it!`,
                    { do: 'updateGuideExpression', value: 'default' },
                    { do: 'unblockTileGrid' },
                    { do: 'startTimer' },
                    `This time, you just need to get *100 dew drops* in *one minute!*`,

                    // Events
                    {
                        on: 'firstSwap',
                        actions: [
                            { do: 'updateGuideExpression', value: 'neutral' },
                            `Hey, remember: you don't get any matches this round.`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'gameOver',
                        actions: [
                            { do: 'blockTileGrid' },
                            { do: 'updateGuideExpression', value: 'surprise' },
                            `Oh no!`,
                            { do: 'updateGuideExpression', value: 'despair' },
                            `*Eezle weezle!*`,
                            { do: 'updateGuideExpression', value: 'sadness' },
                            `You didn't collect any dew drops!`,
                            { do: 'updateGuideExpression', value: 'despair' },
                            `We'll starve!`,
                            { do: 'updateGuideExpression', value: 'sadness' },
                            `*Please!* You have to save us!`,
                            { do: 'endLevel' }
                        ]
                    }
                ];

                /*
            // Level 7 (Pheonix Rises)
            case 7:

                script.introMessages = [
                    "Now, you've been wallowing. You've feeling really low.",
                    "You're in such despair, that in this round...",
                    "There's an obvious combo.",
                    "Right there, right in front of your face.",
                    "But you can't see it through the despair.",
                    "But then, in the last ten seconds of the round, you see it.",
                    "Boom, it's the perfect match.",
                    "And the pheonix rises once again!"
                ];

                break;

            // Level 8 (Victory Lap)
            case 8:

                script.introMessages = [
                    "Our hero is back!",
                    "This final scene is our victory lap.",
                    "However, we don't want too many combos in this round, right?",
                    "This is a round the player wins on their own.",
                    "No assistance from the game.",
                    "A true hero's victory!",
                    "Alright, let's do this: I've got an appointment after this."
                ];

                break;
                */

        }
    }

}