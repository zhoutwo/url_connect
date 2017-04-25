import * as React from "react";
import {Button, FormControl, FormGroup, InputGroup} from "react-bootstrap";

interface IMessengerState {
  message: string;
}

interface IMessengerProps {
  handleSend: (string) => void;
}

class Messenger extends React.Component<IMessengerProps, IMessengerState> {
  constructor(props) {
    super(props);

    this.state = {
      message: ""
    };

    this.handleMessage = this.handleMessage.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  /* Handles message updates */
  public handleMessage(event): void {
    event.preventDefault();
    this.setState({message: event.target.value});
  }

  /* Handles send */
  public handleSend(event): void {
    event.preventDefault();
    this.props.handleSend(this.state.message);
    this.setState({message: ""});
  }

  public render(): JSX.Element {
    return (
      <form onSubmit={this.handleSend}>
        <FormGroup controlId="chatMessageBox" validationState="success">
          <InputGroup>
            <FormControl type="text" value={this.state.message}
            placeholder="message..." onChange={this.handleMessage}
            autoComplete="off" />
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
