const Redox = require("./redox-dom");

class App extends Redox.Component {
    render() {
        return `<Form action="/action_page.php">
  First name:<br/>
  <Text name="firstname" value="Mickey" />
  <br/>
  Last name:<br/>
  <Text name="lastname" value="Mouse" />
  <br/>
  <Submit type="submit" value="Submit" />
</Form>`;
    }
}

Redox.define(App);

Redox.host(`<App/>`, $("#redox"), window);