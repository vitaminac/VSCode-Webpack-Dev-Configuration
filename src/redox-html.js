const Redox = require("./redox");

class HTMLComponent extends Redox.Component {
    constructor(children, properties) {
        super(children, properties);
        for (let property in properties) {
            $(this.$element).attr(property, properties[property]);
        }
    }

    createElement() {
        return $(this.render())[0];
    }

    render() {
        return `<${this.constructor.name.toLowerCase()}>`;
    }
}

class Input extends HTMLComponent {}

define(function () {
    Redox.define(Input);
    return Redox;
})