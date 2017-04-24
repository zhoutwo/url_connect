import * as React from "react";
import {Grid, ListGroup} from "react-bootstrap";

import RoomService from "../service/RoomService";
import Message from "./Message";

class ChatHistory extends React.Component<any, any> {
  private roomService: RoomService;

  constructor(props: any) {
    super(props);

    this.state = {
      messages: []
    };

    this.instantiateRoomService = this.instantiateRoomService.bind(this);
    this.createMessage = this.createMessage.bind(this);
  }

  public render() {
    // Ensure a 500x500 window.
    const historyStyle = {
      height: "268px",
      minHeight: "268px",
      maxHeight: "268px"
    }

    return (
      <div style={historyStyle}>
        {this.state.messages}
      </div>
    );
  }

  public componentWillUnmount() {
    if (this.roomService) this.roomService.close();
  }

  public componentDidMount() {
    this.instantiateRoomService(this.props);
  }

  public componentWillReceiveProps(nextProps) {
    this.roomService.pushMessage(nextProps.pushMessage);
  }

  private createMessage(message) {
    const index = this.state.messages.length + 1;
    const listGroupStyle = {
      marginTop: "3px",
      marginBottom: "3px"
    };

    return (
      <ListGroup style={listGroupStyle}>
        <Message key={index + message} username={this.props.username} message={message} />
      </ListGroup>
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
}

export default ChatHistory;
