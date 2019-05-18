export default class {

    constructor()
    {
        this.queuedActions = [];
        this.currentAction = null;
    }

    isActionRunning()
    {
        return this.currentAction != null;
    }

    hasActions()
    {
        return this.queuedActions.length > 0;
    }

    next()
    {
        this.currentAction = this.queuedActions.shift();
        this.currentAction();
    }

    push(action)
    {
        var self = this;
        self.queuedActions.push(() => { action().then(() => { self.currentAction = null; }) });
    }

}