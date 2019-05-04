Redox = require("./redox-html");

class Form extends Redox.Component {
    render() {
        return `<form action="/action_page.php">
  First name:<br/>
  <Input type="text" name="firstname" value="Mickey"/>
  <br/>
  Last name:<br/>
  <Input type = "text" name="lastname" value="Mouse" />
  <br/><br/>
  <Input type="submit" value="Submit" />
</form>`;
    }
}

Redox.define(Form);

Redox.host(`<Form/>`, $("#redox"), window);