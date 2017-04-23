import React, {Component} from "react";
import {FormGroup, FormControl, Button, InputGroup} from "react-bootstrap";

class Messenger extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "message": ""
    };

    this.handleMessage = this.handleMessage.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  /* Handles message updates */
  handleMessage(event) {
    this.setState({"message": event.target.value});
  }

  /* Handles send */
  handleSend(event) {
    event.preventDefault();
    // TODO: implement.
  }

  render() {
    return (
      <form onSubmit={this.handleSend}>
        <FormGroup controlId="chatMessageBox" validationState="success">
          <InputGroup>
            <FormControl type="text" value={this.state.value} placeholder="message..." onChange={this.handleMessage} />
            <InputGroup.Button>
              <Button bsStyle="info" onClick={this.handleSend}>
                Send
              </Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </form>
    );
  }
}

export default Messenger;
