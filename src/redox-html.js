const Redox = require("./redox");

class HTMLComponent extends Redox.Component {
    constructor(properties) {
        super(properties);
        for (let property in properties) {
            $(this.$elementRef).attr(property, properties[property]);
        }
    }

    render() {
        return `<${this.constructor.name.toLowerCase()}/>`;
    }
}

class HTMLVoidElement extends HTMLComponent {
    createElement() {
        return $(this.render())[0];
    }
}

class Input extends HTMLVoidElement {}

class Form extends HTMLComponent {}

define(function () {
    Redox.define(Input, Form);
    return Redox;
})