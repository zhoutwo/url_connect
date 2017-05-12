import * as React from "react";
import {Button, FormControl, FormControlProps, FormGroup, InputGroup} from "react-bootstrap";

interface IMessengerState {
  message: string;
}

interface IMessengerProps {
  handleSend(message: string): void;
}

class Messenger extends React.Component<IMessengerProps, IMessengerState> {
  constructor(props: IMessengerProps) {
    super(props);

    this.state = {
      message: ""
    };

    this.handleMessage = this.handleMessage.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  /* Handles message updates */
  public handleMessage(event: React.FormEvent<React.Component<FormControlProps, any>>): void {
    event.preventDefault();
    this.setState({message: (event.target as HTMLFormElement).value});
  }

  /* Handles send */
  public handleSend(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const message = this.state.message;
    if (message !== "") {
      this.props.handleSend(this.state.message);
      this.setState({message: ""});
    }
  }

  public render(): JSX.Element {
    return (
      <form onSubmit={this.handleSend}>
        <FormGroup controlId="chatMessageBox" validationState="success">
          <InputGroup>
            <FormControl type="text" value={this.state.message} placeholder="message..." onChange={this.handleMessage} autoComplete="off" />
            <InputGroup.Button>
              <Button bsStyle="info" type="submit">
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
