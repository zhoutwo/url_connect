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
    return (
      <ListGroup style={{overflow: "auto", height: "150px"}}>
        <Grid fluid={true}>
          {this.state.messages}
        </Grid>
      </ListGroup>
    );
  }

  public componentWillUnmount() {
    if (this.roomService) this.roomService.close();
  }

  public componentDidMount() {
    this.instantiateRoomService(this.props);
  }

  public componentWillReceiveProps(nextProps) {
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
}

export default ChatHistory;
