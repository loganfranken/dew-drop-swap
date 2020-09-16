export default class {

    constructor(script, guide, tileGrid)
    {
        this.guide = guide;
        this.tileGrid = tileGrid;
        this.queuedActions = null;

        this.isGuideReady = false;

        const self = this;
        this.guide.on('ready', () => { self.isGuideReady = true; self.next(); });

        this.queueActions(script);
    }

    queueActions(script)
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

        self.next();
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
            this.handleEvent(action.on, action.messages);
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
                this.guide.updateExpression(value);
                break;

            case 'unblockTileGrid':
                this.tileGrid.unblock(context);
                break;
        }
    }

    handleEvent(event, messages)
    {
        const self = this;

        switch(event)
        {
            case 'firstMatch':
                this.tileGrid.on('match', () => self.queueActions(messages));
                break;
        }
    }
}