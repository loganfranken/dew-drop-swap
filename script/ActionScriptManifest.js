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
                    { do: 'updateGuideExpression', value: 'surprise' },
                    { do: 'dropTiles' },
                    `But you can help us by collecting as many dew drops as you can!`,
                    { do: 'updateGuideExpression', value: 'default' },
                    "If you match three or more dew drops of the same color, we can collect them!",
                    { do: 'unblockTileGrid' },
                    "To make a match, select two dew drops and swap their places!",

                    // Events
                    {
                        on: 'firstMatch',
                        actions: [
                            "You got it! That's it!",
                            "See if you can collect 100 dew drops!"
                        ]
                    }

                ];

            // Level 1 (Timer Intro)
            case 1:

                return [
                    `*Oh, doozle!* You're so good at this!`,
                    `But, we'll have to hurry this time!`,
                    { do: 'dropTiles' },
                    `We only have two minutes before the sun dries up all the dew drops!`,
                    `Collect at least 200 dew drops in two minutes!`,
                    { do: 'unblockTileGrid' },
                    { do: 'startTimer' }
                ];

                break;

            // Level 2 (Breaking the Fourth Wall)
            case 2:

                return [
                    `Wow, we're so proud of you!`,
                    `This round you'll only have 30 seconds to collect at least 300 dew drops!`,

                    // Events
                    {
                        on: 'gameOver',
                        actions: [
                            `Wait, wait, sorry, hold on.`,
                            `It's too early for the *\"Lose in a Panic\"* scenario.`,
                            `So sorry about that.`,
                            `You've been really great so far, honestly.`,
                            `You know, what, let's just go to the next round and we'll take it from the top.`
                        ]
                    }
                ];

                break;

                /*
            // Level 3 (Easy Win)
            case 3:

                script.introMessages = [
                    "Alright, I think we've got everything figured out.",
                    "Okay, for this next round, let me set you up:",
                    "Remember, you've been winning the last few rounds and you're gaining confidence.",
                    "In this round, it's going to be easy for you to get combos.",
                    "So the idea here is that you're going to get a little *too* confident, right?",
                    "Like a little full of yourself, alright?",
                    "Okay, great! Let's do this:",
                    "...",
                    "*Oh doozle woozle!*",
                    "You're so amazing!",
                    "You have two minutes again, but this time you'll have to collect 300 dew drops.",
                    "Can you do it?",
                    "Who am I kidding? Of course you can!"
                ];

                break;

            // Level 4 (Losing Confidence)
            case 4:

                script.introMessages = [
                    "Okay, okay, great stuff.",
                    "For this round, you're bringing all of that pride, all of that hubris.",
                    "And, when the round starts, things are still going your way.",
                    "But guess what?",
                    "Halfway through this round, things start getting a little harder.",
                    "So this is where we begin to chip away at your pride as the player.",
                    "Alright, that's your set up: now let me get into the right headspace.",
                    "...oh doozle woo-",
                    "...no, no, it's doozy-woozy here...",
                    "...yeah, doozy-woozy, you're our hero, blah, blah...",
                    "Alright! Got it!",
                    "...",
                    "*Doozy-woozy!*",
                    "You're our hero!",
                    "You've done so much for us, but we still need your help!",
                    "We need you to collect 500 dew drops in five minutes!" 
                ];

                break;

            // Level 5 (Fall From Grace)
            case 5:

                script.introMessages = [
                    "Wow, such moving work.",
                    "It really feels so authentic.",
                    "It's been a joy working with you.",
                    "Okay, here we go, this is a pivotal scene:",
                    "This round will not go your way at all. At all.",
                    "This is your fall from grace.",
                    "(Ahem)",
                    "...",
                    "*Doozle!*",
                    "*Woozle!*",
                    "I can't believe you did it!",
                    "We've got a bigger challenge ahead, but I know you can do it!",
                    "You can do anything!",
                    "We need you to collect 1000 dew drops in five minutes!"
                ];

                break;

            // Level 6 (Wallowing)
            case 6:

                script.introMessages = [
                    "Okay, let's move right into the next scene:",
                    "Here, you are wallowing, right?",
                    "You are in the pit of despair and you can't see a way out.",
                    "This round won't be particularly hard, but you can't seem to find any matches.",
                    "Got it?",
                    "Alright, great: let me find my place here...",
                    "Yes, okay, I believed in you, but now my faith is faltering...",
                    "I'm keeping a brave face, but I'm really starting to lose confidence...",
                    "Okay, I'm ready!",
                    "...",
                    "Oh no!",
                    "*Whoopsie whoozle!*",
                    "Don't worry, that was a tough one!",
                    "Let's try again! I know you can do it!",
                    "We need you to collect 1000 dew drops in five minutes!"
                ];

                script.getDisplayTileMatchMessages = (data) => {

                    return [
                        "(Oh, hey: remember, you're not going to find any matches this round)"
                    ];

                };

                break;

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