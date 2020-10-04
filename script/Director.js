import LevelManifest from "./LevelManifest";

export default class {

    constructor(script, guide, timer, scoreDisplay, tileGrid, scene, context)
    {
        this.guide = guide;
        this.timer = timer;
        this.scoreDisplay = scoreDisplay;
        this.tileGrid = tileGrid;
        this.scene = scene;

        this.gameOverSubscriptions = [];
        this.queuedActions = null;

        this.isGuideReady = false;

        const self = this;
        this.guide.on('ready', () => { self.isGuideReady = true; self.next(context); });

        this.queueActions(script);
    }

    queueActions(script, context)
    {
        if(!script)
        {
            return;
        }

        const self = this;

        if(self.queuedActions === null)
        {
            self.queuedActions = [];
        }

        self.queuedActions.push(...script);

        self.next(context);
    }

    next(context)
    {
        if(!this.isGuideReady)
        {
            return;
        }

        if(this.guide.isTalking)
        {
            return;
        }

        if(this.queuedActions.length === 0)
        {
            return;
        }

        const action = this.queuedActions.shift();

        // Simple dialog message
        if(typeof action === "string")
        {
            // Are there any more messages after this one?
            const isLastMessage = this.queuedActions.every(a => typeof a !== "string");

            this.handleMessage(action, isLastMessage);
        }

        // Game action
        else if(action.hasOwnProperty('do'))
        {
            this.handleAction(action.do, action.value, context);
            this.next(context);
        }

        // Event
        else if(action.hasOwnProperty('on'))
        {
            this.handleEvent(action.on, action.actions, action.filter, context, action.persist);
            this.next(context);
        }
    }

    handleMessage(action, hideEndDialogMarker)
    {
        this.guide.displayMessage(action, hideEndDialogMarker);
    }

    handleAction(action, value, context)
    {
        switch(action)
        {
            // Tile Actions

            case 'dropTiles':
                this.tileGrid.fill(context);
                break;

            case 'unblockTileGrid':
                this.tileGrid.unblock(context);
                break;

            case 'blockTileGrid':
                this.tileGrid.block(context, value);
                break;

            case 'updateTileGenerationBehavior':
                this.tileGrid.updateTileGenerationBehavior(value);
                break;


            // Guide Actions

            case 'updateGuideExpression':
                this.guide.updateExpression(value, context);
                break;

            case 'hideGuide':
                this.guide.hide(context);
                break;


            // Timer Actions

            case 'startTimer':
                this.timer.start();
                break;

            case 'updateTimer':
                this.timer.ticks = value;
                break;

            case 'stopTimer':
                this.timer.stop();
                break;

            case 'updateTimerRelativeToScore':
                const levelInfo = LevelManifest[this.scene.level];
                this.timer.update(this.getScoreRelativeTicks(levelInfo.timer, this.scene.score, levelInfo.score));
                break;


            // Score Actions

            case 'hideScoreDisplay':
                this.scoreDisplay.hide(context);
                break;

            
            // Level Actions

            case 'endLevel':
                this.scene.endLevel();
                break;

            case 'revokeLevelTransition':
                this.scene.isTransitioningRounds = false;
                break;

            case 'revokeBlockMatching':
                this.scene.isBlockingMatches = false;
                break;
        }
    }

    handleEvent(event, actions, filter, context, persist)
    {
        let target = null;

        switch(event)
        {
            case 'match':
                target = this.tileGrid;
                break;

            case 'swap':
            case 'win':
            case 'gameOver':
                target = this.scene.emitter;
                break;

            case 'tick':
                target = this.timer;
                break;
        }

        this.setUpEvent(target, event, actions, filter, context, persist);
    }

    setUpEvent(target, eventName, actions, filter, context, persist)
    {
        const self = this;
        target.on(eventName, this.wrapFilter(filter), () => self.queueActions(actions, context), persist);
    }

    wrapFilter(filter)
    {
        const self = this;

        if(typeof filter === 'undefined')
        {
            return null;
        }

        return () => { return filter(self.getCurrentState()); };
    }

    getCurrentState()
    {
        return {
            matches: this.tileGrid.matches,
            score: this.scene.score,
            ticks: this.timer.ticks
        };
    }

    getScoreRelativeTicks(targetTicks, currScore, targetScore)
    {
        return Math.max(Math.trunc(targetTicks - ((currScore / targetScore) * targetTicks)), 1);
    }
}