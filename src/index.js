Redox = require("./redox-html");

class Test extends Redox.Component {
    render() {
        return `<Form action="/action_page.php">
  First name:<br/>
  <Input type="text" name="firstname" value="Mickey"/>
  <br/>
  Last name:<br/>
  <Input type = "text" name="lastname" value="Mouse" />
  <br/><br/>
  <Input type="submit" value="Submit" />
</Form>`;
    }
}

Redox.define(Test);

Redox.host(`<Test/>`, $("#redox"), window);