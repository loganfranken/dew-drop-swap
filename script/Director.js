export default class {

    constructor(script, guide, timer, tileGrid, scene, context)
    {
        this.guide = guide;
        this.timer = timer;
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
            this.handleEvent(action.on, action.actions, action.filter, context);
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
            case 'dropTiles':
                this.tileGrid.fill(context);
                break;

            case 'updateGuideExpression':
                this.guide.updateExpression(value, context);
                break;

            case 'unblockTileGrid':
                this.tileGrid.unblock(context);
                break;

            case 'blockTileGrid':
                this.tileGrid.block(context);
                break;

            case 'startTimer':
                this.timer.start();
                break;

            case 'endLevel':
                this.scene.endLevel();
                break;

            case 'updateTileGenerationBehavior':
                this.tileGrid.updateTileGenerationBehavior(value);
                break;
        }
    }

    handleEvent(event, actions, filter, context)
    {
        const self = this;

        switch(event)
        {
            case 'match':
                this.tileGrid.on('match', this.wrapFilter(filter), () => self.queueActions(actions, context));
                break;

            case 'gameOver':
                this.scene.emitter.on('gameOver', () => self.queueActions(actions, context));
                break;

            case 'halfComplete':
                this.scene.emitter.on('halfComplete', () => self.queueActions(actions, context));
                break;

            case 'firstSwap':
                this.scene.emitter.on('swap', () => self.queueActions(actions, context));
                break;

            case 'win':
                this.scene.emitter.on('win', () => self.queueActions(actions, context));
        }
    }

    wrapFilter(filter)
    {
        const self = this;
        return () => { return filter(self.getCurrentState()); };
    }

    getCurrentState()
    {
        return {
            matches: this.tileGrid.matches,
            score: this.scene.score
        };
    }
}