Redox = require("./redox");

class Title extends Redox.Component {
    render() {
        return `<h1>This is Redox init project</h1>`;
    }
}

Redox.host(new Title(), $("#redox"));