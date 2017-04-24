import * as React from "react";
import {ListGroup} from "react-bootstrap";

class ChatHistory extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      messages: []
    };

    this.instantiateRoomService = this.instantiateRoomService.bind(this);
    this.createMessage = this.createMessage.bind(this);
  }

  private componentWillUnmount() {
    if (this.roomService) this.roomService.close();
  }

  private componentDidMount() {
    this.instantiateRoomService(this.props);
  }

  private componentWillReceiveProps(nextProps) {
    console.log(nextProps.pushMessage);
    this.roomService.pushMessage(nextProps.pushMessage);
  }

  private createMessage(message) {
    return (
      <Message username={this.props.username} message={message} />
    );
  }

  private instantiateRoomService(props) {
    this.setState({messages: []});

    // set up Room Service
    this.roomService = new RoomService(props.url, (message) => {
      this.setState((prevState, nextProps) => {
        prevState.messages.push(this.createMessage(message));
        return prevState;
      });
    });
  }

  render() {
    return (
      null
    );
  }
}

export default ChatHistory;
