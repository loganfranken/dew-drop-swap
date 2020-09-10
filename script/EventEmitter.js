export default class {

    constructor()
    {
        this.subscriptions = [];
    }

    on(eventName, callback)
    {
        this.subscriptions.push({ eventName, callback });
    }

    emit(eventName)
    {
        this.subscriptions
            .filter(subscription => subscription.eventName === eventName)
            .forEach(subscription => {
                subscription.callback && subscription.callback();
                subscription.callback = null;
            });
    }
}