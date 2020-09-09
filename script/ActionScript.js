export default class {

    constructor(script)
    {
        this.introScript = [];
        this.triggers = {};

        script.forEach(element => {
            
            if(element.hasOwnProperty('on'))
            {
                this.triggers[element.on] = element.messages;
            }
            else
            {
                this.introScript.push(element);
            }

        });
    }

}