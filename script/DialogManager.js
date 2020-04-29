import DialogScript from "./DialogScript";

export default class {

    getScript(level)
    {
        const script = new DialogScript();

        switch(level)
        {
            // Level 0 (Intro)
            case 0:

                script.introMessages = [
                    `*Oh, doozle, you made it!* You're here! (Click or tap anywhere!)`,
                    `The Dew Drop Kingdom is in trouble!`,
                    `We lost all of our dew drops and now we'll starve!`,
                    `But you can help us by collecting as many dew drops as you can!`,
                    "If you match three or more dew drops of the same color, we can collect them!",
                    "To make a match, select two dew drops and swap their places!"
                ];

                script.getDisplayTileMatchMessages = (data) => {

                    if(data.totalMatches === 1)
                    {
                        return [
                            "You got it! That's it!",
                            "You collect extra dew drops when you chain together matches in a combo!",
                            "See if you can collect 100 dew drops!"
                        ];
                    }

                };

                break;

            // Level 1 (Timer Intro)
            case 1:

                script.introMessages = [
                    "*Oh, doozle!* You're so good at this!",
                    "But, we'll have to hurry this time!",
                    "We only have two minutes before the sun dries up all the dew drops!",
                    "Collect at least 200 dew drops in two minutes!"
                ];

                break;

            // Level 2 (Breaking the Fourth Wall)
            case 2:

                script.introMessages = [
                    "Wow, we're so proud of you!",
                    "This round you'll only have 30 seconds to collect at least X dew drops!"
                ];

                // "Wait, wait, sorry, hold on."
                // "It's too early for the \"Lose in a Panic\" scenario."
                // "So sorry about that."
                // "You've been really great so far, honestly."
                // "You know, what, let's just go to the next round and we'll take it from the top."

                break;

            // Level 3 (Easy Win)
            case 3:

                script.introMessages = [
                    "Alright, I think we've got everything figured out.",
                    "Okay, for this next round, let me set you up:",
                    "Remember, you've been winnig the last few rounds and you're gaining confidence.",
                    "In this round, it's going to be easy for you to get combos.",
                    "So the idea here is that you're going to get a little too confident, right?",
                    "Like a little full of yourself, alright?",
                    "Okay, great! Let's do this:"
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
                    "This is where we to start your chip away at your pride as the player."
                ];

                break;

            // Level 5 (Fall From Grace)
            case 5:

                script.introMessages = [
                    "Wow, really moving work. It feels so authentic.",
                    "It's been a joy working with you.",
                    "Okay, here we go, this is a pivotal scene:",
                    "This round will not go your way at all. At all.",
                    "This is your fall from grace.",
                ];

                break;

            // Level 6 (Wallowing)
            case 6:

                script.introMessages = [
                    "Okay, let's move right into the next scene:",
                    "Here, you are wallowing, right?",
                    "You are in the pit of despair and you can't see a way out.",
                    "This round won't be particularly hard, but you can't seem to find any matches."
                ];

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

        }

        return script;
    }

}