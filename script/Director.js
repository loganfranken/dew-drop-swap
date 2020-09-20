export default class {

    constructor(script, guide, timer, tileGrid, context)
    {
        this.guide = guide;
        this.timer = timer;
        this.tileGrid = tileGrid;
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
            this.handleMessage(action);
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
            this.handleEvent(action.on, action.actions, context);
            this.next(context);
        }
    }

    handleMessage(action)
    {
        this.guide.displayMessage(action);
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

            case 'startTimer':
                this.timer.start();
                break;
        }
    }

    handleEvent(event, actions, context)
    {
        const self = this;

        switch(event)
        {
            case 'firstMatch':
                this.tileGrid.on('match', () => self.queueActions(actions, context));
                break;

            case 'gameOver':
                this.tileGrid.on('gameOver', () => self.queueActions(actions, context));
        }
    }
}