import * as React from "react";
import {Grid, ListGroup} from "react-bootstrap";

import RoomService from "../service/RoomService";
import Message from "./Message";

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
      <ListGroup style={{overflow: "auto", height: "150px"}}>
        <Grid fluid>
          {this.state.messages}
        </Grid>
      </ListGroup>
    );
  }
}

export default ChatHistory;
