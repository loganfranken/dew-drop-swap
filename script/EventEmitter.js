export default class {

    constructor()
    {
        this.subscriptions = [];
    }

    on(eventName, filter, callback)
    {
        this.subscriptions.push({ eventName, filter, callback });
    }

    emit(eventName)
    {
        this.subscriptions
            .filter(subscription => subscription.eventName === eventName)
            .filter(subscription => typeof subscription.filter !== "undefined" && subscription.filter())
            .forEach(subscription => {
                subscription.callback && subscription.callback();
                subscription.callback = null;
            });
    }
}