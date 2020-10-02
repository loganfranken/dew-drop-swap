export default class {

    constructor()
    {
        this.subscriptions = [];
    }

    on(eventName, filter, callback, persist)
    {
        this.subscriptions.push({ eventName, filter, callback, persist });
    }

    emit(eventName)
    {
        this.subscriptions
            .filter(subscription => subscription.eventName === eventName)
            .filter(subscription => subscription.filter === null || subscription.filter())
            .forEach(subscription => {
                subscription.callback && subscription.callback();

                if(subscription.persist)
                {
                    return;
                }

                subscription.callback = null;
            });
    }
}