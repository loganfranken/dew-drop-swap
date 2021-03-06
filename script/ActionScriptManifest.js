import LevelManifest from './LevelManifest';
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
                    `If you match three or more dew drops of the same color, we can collect them!`,
                    { do: 'unblockTileGrid' },
                    `To make a match, select two dew drops and swap their places!`,

                    // Events
                    {
                        on: 'match',
                        filter: (state) => (state.matches >= 1),
                        actions: [
                            { do: 'updateGuideExpression', value: 'glee' },
                            `You got it! That's it!`,
                            { do: 'updateGuideExpression', value: 'default' },
                            { do: 'showScoreDisplay' },
                            `See if you can collect *50 dew drops*!`
                        ]
                    },

                    {
                        on: 'match',
                        filter: (state) => (state.matches > 1),
                        actions: [
                            { do: 'showScoreDisplay' }
                        ]
                    },

                    {
                        on: 'match',
                        filter: (state) => (state.matches === 5),
                        actions: [
                            { do: 'updateGuideExpression', value: 'glee' },
                            `*Wow!* Look at you go!`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'match',
                        filter: (state) => (state.score > (LevelManifest[0].score * 0.5)),
                        actions: [
                            { do: 'updateGuideExpression', value: 'glee' },
                            `*Doozle!* You're almost there!`,
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
                    { do: 'showTimerDisplay' },
                    { do: 'updateGuideExpression', value: 'default' },
                    { do: 'unblockTileGrid' },
                    { do: 'startTimer' },
                    `Collect at least *100 dew drops* in *two minutes*!`,

                    // Events
                    {
                        on: 'match',
                        filter: (state) => (state.matches === 5),
                        actions: [
                            { do: 'updateGuideExpression', value: 'glee' },
                            `*Doozle!* What a match!`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'match',
                        filter: (state) => (state.score > (LevelManifest[1].score * 0.5)),
                        actions: [
                            { do: 'updateGuideExpression', value: 'glee' },
                            `You're halfway there! You can do it!`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'tick',
                        filter: (state) => (state.ticks < 30),
                        actions: [
                            { do: 'updateGuideExpression', value: 'nervous' },
                            `Only *30 seconds* left! You can do this!`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'gameOver',
                        actions: [
                            { do: 'pauseBackgroundMusic', value: false },
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
                            { do: 'endLevel' },
                            { do: 'resumeBackgroundMusic' }
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
                    `This round you'll only have *30 seconds* to collect *100 dew drops*!`,
                    { do: 'unblockTileGrid' },
                    { do: 'startTimer' },

                    // Events
                    {
                        on: 'gameOver',
                        actions: [
                            { do: 'pauseBackgroundMusic', value: false },
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
                            { do: 'pauseBackgroundMusic' },
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
                    `Remember, you've been winning the last few rounds and you're gaining confidence.`,
                    { do: 'updateGuideExpression', value: 'amused' },
                    `In this round, it's going to be easy for you to get combos.`,
                    `So you're going to get a little *too* confident, right?`,
                    { do: 'updateGuideExpression', value: 'confused' },
                    `Like a little full of yourself, yeah?`,
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Okay, great! Let's do this:`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    "...",
                    "...",
                    "...",
                    { do: 'resumeBackgroundMusic' },
                    { do: 'updateGuideExpression', value: 'default' },
                    `*Oh doozle woozle!*`,
                    { do: 'updateGuideExpression', value: 'surprise' },
                    `You're so amazing!`,
                    { do: 'updateGuideExpression', value: 'default' },
                    { do: 'dropTiles' },
                    `You have *two minutes* again, but this time you'll have to collect *200 dew drops*.`,
                    { do: 'updateGuideExpression', value: 'confused' },
                    `Can you do it?`,
                    { do: 'updateGuideExpression', value: 'default' },
                    { do: 'unblockTileGrid' },
                    { do: 'startTimer' },
                    { do: 'updateGuideExpression', value: 'glee' },
                    `Who am I kidding? Of course you can!`,
                    { do: 'updateGuideExpression', value: 'default' },

                    // Events
                    {
                        on: 'gameOver',
                        actions: [
                            { do: 'pauseBackgroundMusic', value: false },
                            { do: 'blockTileGrid' },
                            { do: 'updateGuideExpression', value: 'confused' },
                            `Oh, uhh?`,
                            { do: 'updateGuideExpression', value: 'neutral' },
                            `No, you win this round too.`,
                            { do: 'updateGuideExpression', value: 'thoughtful' },
                            `Uhh, hmm...`,
                            { do: 'updateGuideExpression', value: 'amused' },
                            `Okay, here's what we'll do:`,
                            { do: 'revokeLevelTransition' },
                            { do: 'updateTimer', value: 1 },
                            { do: 'stopTimer' },
                            { do: 'unblockTileGrid' },
                            { do: 'resumeBackgroundMusic' },
                            `Go ahead and finish out the round and we'll edit it together later.`
                        ]
                    },

                    {
                        on: 'match',
                        filter: (state) => (state.score > (LevelManifest[3].score * 0.25)),
                        actions: [
                            { do: 'updateGuideExpression', value: 'glee' },
                            `Look at you go! You're our hero!`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'match',
                        filter: (state) => (state.score > (LevelManifest[3].score * 0.5)),
                        actions: [
                            { do: 'updateGuideExpression', value: 'surprise' },
                            `*Wow!* You're unstoppable!`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'match',
                        filter: (state) => (state.score > (LevelManifest[3].score * 0.75)),
                        actions: [
                            { do: 'updateGuideExpression', value: 'glee' },
                            `*Oozle!*`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'match',
                        filter: (state) => (state.score > (LevelManifest[3].score * 0.85)),
                        actions: [
                            { do: 'updateGuideExpression', value: 'glee' },
                            `*Woozle!*`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'match',
                        filter: (state) => (state.score > (LevelManifest[3].score * 0.95)),
                        actions: [
                            { do: 'updateGuideExpression', value: 'surprise' },
                            `*Doozle!*`,
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

            // Level 4 (Losing Confidence)
            case 4:

                return [
                    { do: 'pauseBackgroundMusic' },
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
                    `...no, doozy-woozy...`,
                    `...yeah, doozy-woozy, you're our hero...`,
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Alright! Got it!`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `...`,
                    `...`,
                    `...`,
                    { do: 'resumeBackgroundMusic' },
                    { do: 'updateGuideExpression', value: 'surprise' },
                    `*Doozy-woozy!*`,
                    { do: 'updateGuideExpression', value: 'glee' },
                    `You're our hero!`,
                    { do: 'dropTiles' },
                    { do: 'updateGuideExpression', value: 'default' },
                    `You've done so much for us, but we still need your help!`,
                    { do: 'unblockTileGrid' },
                    { do: 'startTimer' },
                    `We need you to collect *250 dew drops* in *two minutes*!`,

                    // Events
                    {
                        on: 'match',
                        filter: (state) => { return state.score > (LevelManifest[4].score * 0.25) },
                        actions: [
                            { do: 'updateGuideExpression', value: 'glee' },
                            `Nothing can stop you!`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'match',
                        filter: (state) => { return state.score > (LevelManifest[4].score * 0.5) },
                        actions: [
                            { do: 'updateGuideExpression', value: 'neutral' },
                            { do: 'updateTileGenerationBehavior', value: TileGenerationBehavior.Hard },
                            `Alright, we're going to crank up that difficulty now.`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'match',
                        filter: (state) => { return state.score > (LevelManifest[4].score * 0.75) },
                        actions: [
                            `Come on! You can do it!`
                        ]
                    },

                    {
                        on: 'gameOver',
                        actions: [
                            { do: 'pauseBackgroundMusic', value: false },
                            { do: 'blockTileGrid' },
                            { do: 'updateGuideExpression', value: 'confused' },
                            `Oh, a game over?`,
                            { do: 'updateGuideExpression', value: 'neutral' },
                            `We had a win penciled in here.`,
                            { do: 'updateGuideExpression', value: 'thoughtful' },
                            `Maybe a game over could work?`,
                            { do: 'updateGuideExpression', value: 'neutral' },
                            `No, you know what:`,
                            { do: 'revokeLevelTransition' },
                            { do: 'updateTimer', value: 1 },
                            { do: 'stopTimer' },
                            { do: 'unblockTileGrid' },
                            { do: 'resumeBackgroundMusic' },
                            `Just go ahead and finish this off as a win.`
                        ]
                    },

                    {
                        on: 'win',
                        actions: [
                            { do: 'endLevel' }
                        ]
                    }
                ];

            // Level 5 (Fall From Grace)
            case 5:

                return [
                    { do: 'pauseBackgroundMusic' },
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Wow, great stuff.`,
                    `I know this is cliché, but it really feels so authentic.`,
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
                    { do: 'resumeBackgroundMusic' },
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
                    `We need you to collect *300 dew drops* in *two minutes*!`,

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
                    },

                    {
                        on: 'match',
                        filter: (state) => { return state.score > (LevelManifest[5].score * 0.25) },
                        actions: [
                            { do: 'updateGuideExpression', value: 'glee' },
                            `Look at you go!`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },


                    {
                        on: 'match',
                        filter: (state) => { return state.score > (LevelManifest[5].score * 0.5) },
                        actions: [
                            { do: 'updateGuideExpression', value: 'neutral' },
                            `Oh, wait, hold on: you're not supposed to be doing well this round, remember?`,
                            { do: 'updateGuideExpression', value: 'amused' },
                            `Hey, I know it can be tough when you get in the flow.`,
                            { do: 'updateGuideExpression', value: 'neutral' },
                            `Let's just lock the tiles until the end.`,
                            { do: 'blockTileGrid' },
                            { do: 'updateGuideExpression', value: 'default' },
                        ]
                    },

                    {
                        on: 'tick',
                        filter: (state) => (state.ticks < 30),
                        actions: [
                            { do: 'updateGuideExpression', value: 'nervous' },
                            `*Eezy-weezy!* Time is running short!`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'tick',
                        filter: (state) => (state.ticks < 15),
                        actions: [
                            { do: 'updateGuideExpression', value: 'nervous' },
                            `You're so close! Don't give up!`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    }
                ];

            // Level 6 (Wallowing)
            case 6:

                return [
                    { do: 'pauseBackgroundMusic' },
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
                    `...yes, yes, my faith is faltering...`,
                    `...keeping a brave face...`,
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Okay, I'm ready!`,
                    `...`,
                    `...`,
                    `...`,
                    { do: 'resumeBackgroundMusic' },
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
                        on: 'swap',
                        actions: [
                            { do: 'updateGuideExpression', value: 'neutral' },
                            `Hey, remember: you don't get any matches this round.`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'tick',
                        filter: (state) => (state.ticks < 45),
                        actions: [
                            { do: 'updateGuideExpression', value: 'nervous' },
                            `Don't worry! You can do it!`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'tick',
                        filter: (state) => (state.ticks < 30),
                        actions: [
                            { do: 'updateGuideExpression', value: 'nervous' },
                            `You just need to get a few matches!`,
                        ]
                    },

                    {
                        on: 'tick',
                        filter: (state) => (state.ticks < 15),
                        actions: [
                            { do: 'updateGuideExpression', value: 'sadness' },
                            `Please, we're running out of time!`,
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

            // Level 7 (Pheonix Rises)
            case 7:

                return [
                    { do: 'pauseBackgroundMusic' },
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Wow, I'm really feeling it.`,
                    `How about you?`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `Alright, next up:`,
                    `You've been wallowing.`,
                    `You're feeling really low.`,
                    { do: 'updateGuideExpression', value: 'thoughtful' },
                    `And, you're in such despair, that in this round...`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `There's an obvious combo.`,
                    `Right there, right in front of your face.`,
                    { do: 'updateGuideExpression', value: 'thoughtful' },
                    `But you can't see it through the despair.`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `But then, in the last 30 seconds of the round, you see it!`,
                    { do: 'updateGuideExpression', value: 'amused' },
                    `The perfect match.`,
                    `And the pheonix rises once again!`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `Alright! Here we go!`,
                    `...`,
                    `...`,
                    `...`,
                    { do: 'resumeBackgroundMusic' },
                    { do: 'updateGuideExpression', value: 'despair' },
                    `Oh, boozle...`,
                    `What will we do?`,
                    { do: 'updateGuideExpression', value: 'sadness' },
                    `Please, you're our only hope!`,
                    { do: 'updateGuideExpression', value: 'despair' },
                    `We have one more chance...`,
                    { do: 'dropTiles' },
                    `Please! Save our kingdom! Just get *30 dew drops* in *two minutes*!`,
                    { do: 'unblockTileGrid' },
                    { do: 'startTimer' },

                    // Events
                    {
                        on: 'swap',
                        filter: (state) => (state.ticks > 30 && state.isBlockingMatches),
                        actions: [
                            { do: 'updateGuideExpression', value: 'neutral' },
                            `Hold on, it's not time to swap yet.`,
                            `Wait until there's only *30 seconds* left.`,
                            { do: 'updateGuideExpression', value: 'despair' }
                        ]
                    },

                    {
                        on: 'tick',
                        filter: (state) => (state.ticks <= 30),
                        actions: [
                            { do: 'updateGuideExpression', value: 'neutral' },
                            { do: 'stopTimer' },
                            `Alright, here we go.`,
                            `Just to make sure we get this right, we'll stop the timer.`,
                            { do: 'updateGuideExpression', value: 'thoughtful' },
                            `And we'll highlight the match you'll want to make.`,
                            { do: 'blockTileGrid', value: [ [9, 2], [9, 3] ] },
                            { do: 'updateGuideExpression', value: 'amused' },
                            `And the rest is up to you!`,
                            { do: 'revokeBlockMatching' }
                        ]
                    },

                    {
                        on: 'swap',
                        filter: (state) => (!state.isBlockingMatches),
                        actions: [
                            { do: 'unblockTileGrid' }
                        ]
                    },

                    {
                        on: 'win',
                        actions: [
                            { do: 'endLevel' }
                        ]
                    }
                ];

            // Level 8 (Victory Lap)
            case 8:

                return [
                    { do: 'pauseBackgroundMusic' },
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Hey, our hero is back!`,
                    `Very moving work.`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `Okay: this next scene is the last one.`,
                    { do: 'updateGuideExpression', value: 'thoughtful' },
                    `It's your victory lap.`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `To sell this one, we really need to get the pacing right.`,
                    { do: 'updateGuideExpression', value: 'thoughtful' },
                    `We want you getting a steady flow of matches the whole time.`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `If you win too early, it's no fun to watch, you know?`,
                    { do: 'updateGuideExpression', value: 'amused' },
                    `But don't worry, we got your back.`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `We'll just advance the timer as you get matches, yeah?`,
                    `And then we can edit it all together later.`,
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Alright! Let's wrap this up!`,
                    { do: 'updateGuideExpression', value: 'thoughtful' },
                    `...`,
                    `...`,
                    `...`,
                    { do: 'resumeBackgroundMusic' },
                    { do: 'updateGuideExpression', value: 'glee' },
                    `*Oh doozie woozie!*`,
                    { do: 'updateGuideExpression', value: 'default' },
                    `I knew you could do it!`,
                    `You're our hero!`,
                    { do: 'updateGuideExpression', value: 'confused' },
                    `...`,
                    { do: 'updateGuideExpression', value: 'surprise' },
                    `*Oozle!*`,
                    { do: 'dropTiles' },
                    { do: 'updateGuideExpression', value: 'glee' },
                    `Look at all of those dew drops!`,
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Now's our chance!`,
                    `If you can gather up a big haul, we can save the kingdom!`,
                    `I know it's a lot to ask, but please help us one more time!`,
                    `*300 dew drops* in *3 minutes!*`,
                    { do: 'unblockTileGrid' },

                    {
                        on: 'match',
                        actions: [
                            { do: 'updateTimerRelativeToScore' }
                        ],
                        persist: true
                    },

                    {
                        on: 'match',
                        filter: (state) => (state.score > (LevelManifest[8].score * 0.25)),
                        actions: [
                            { do: 'updateGuideExpression', value: 'glee' },
                            `*Doozle!* What a match!`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'match',
                        filter: (state) => (state.score > (LevelManifest[8].score * 0.5)),
                        actions: [
                            { do: 'updateGuideExpression', value: 'surprise' },
                            `*Woozle!* No one can match like you!`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'match',
                        filter: (state) => (state.score > (LevelManifest[8].score * 0.75)),
                        actions: [
                            { do: 'updateGuideExpression', value: 'glee' },
                            `*Doozy-woozy!* Our kingdom is saved!`,
                            { do: 'updateGuideExpression', value: 'default' }
                        ]
                    },

                    {
                        on: 'win',
                        actions: [
                            { do: 'blockTileGrid' },
                            { do: 'endLevel' }
                        ]
                    }
                ];

            // Epilogue
            case 9:

                return [
                    { do: 'updateGuideExpression', value: 'amused' },
                    `And that's a wrap!`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `I think it went pretty well today, right?`,
                    { do: 'updateGuideExpression', value: 'thoughtful' },
                    { do: 'hideScoreDisplay' },
                    `Huh?`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `Oh, looks like they're shutting things down.`,
                    `...`,
                    `...`,
                    `So, any-`,
                    { do: 'dropTiles' },
                    { do: 'updateGuideExpression', value: 'confused' },
                    `Oh, whoops, tiles must have dropped on accident.`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `...`,
                    `...`,
                    `Yeah, so, anyway.`,
                    `I've gotta head out.`,
                    `...`,
                    { do: 'updateGuideExpression', value: 'amused' },
                    `Nice working with you today!`,
                    { do: 'updateGuideExpression', value: 'neutral' },
                    `...`,
                    { do: 'hideGuide' },
                    { do: 'unblockTileGrid' },
                    { wait: 30000 },
                    { do: 'pauseBackgroundMusic' },
                    { wait: 30000 },
                    { do: 'turnOffLights' }
                ];
        }
    }

}