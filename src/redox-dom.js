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

define(function () {
    Redox.define(
        class Text extends HTMLVoidElement {
            render() {
                return `<input type="text">`;
            }
        },
        class Submit extends HTMLVoidElement {
            render() {
                return `<input type="submit">`;
            }
        },
        class Form extends HTMLComponent {}
    );
    return Redox;
})