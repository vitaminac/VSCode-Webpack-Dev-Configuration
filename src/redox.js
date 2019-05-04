define(function () {
    const directives = new Map();
    const parser = new DOMParser();

    function parseTemplate(template, context) {
        const doc = parser.parseFromString(template, "application/xml");
        const element = doc.documentElement;
        const rootNodeName = element.nodeName;
        if (rootNodeName[0] === rootNodeName[0].toUpperCase()) {
            const Component = directives.get(rootNodeName);
            const attributes = {};
            for (let attribute of element.attributes) {
                attributes[attribute.name] = attribute.value;
            }
            return new Component(element.children, attributes).$element;
        } else {
            $(element).find("*").each(function (idx, e) {
                if (e.nodeName[0] === e.nodeName[0].toUpperCase()) {
                    $(e).replaceWith(parseTemplate(e.outerHTML, context));
                }
            });
            return element;
        }
    }
    return {
        host: function (template, element, context) {
            $(element).empty().append(parseTemplate(template, context));
        },
        define: function (component) {
            directives.set(component.name, component);
        },
        Component: class {
            constructor(children, properties) {
                this.children = children;
                this.properties = properties;
                this.$element = this.createElement();
                if (properties) {
                    if (properties.click) this.element.onclick = properties.click;
                }
            }

            createElement() {
                return parseTemplate(this.render(), this);
            }

            render() {
                throw "must be implemented";
            }
        }
    }
});