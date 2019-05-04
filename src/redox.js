define(function () {
    function parseDOM(component) {
        return $(component.render());
    }
    return {
        host: function (component, element) {
            $(element).empty().append(component.$element);
        },
        Component: class {
            constructor(properties, events) {
                this.$element = parseDOM(this);
                if (properties) {}
                if (events) {
                    if (events.click) this.element.onclick = events.click;
                }
            }

            render() {
                throw "must be implemented";
            }
        }
    }
});