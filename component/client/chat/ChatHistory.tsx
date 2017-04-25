import * as React from "react";
import {ListGroup} from "react-bootstrap";
import * as ReactDOM from "react-dom";

import RoomService from "../service/RoomService";
import Message from "./Message";

interface IHistoryState {
  messages: Array<JSX.Element>;
}

interface IHistoryProps {
  username: string;
  pushMessage: string;
}

class ChatHistory extends React.Component<IHistoryProps, IHistoryState> {
  private roomService: RoomService;
  private historyEnd: HTMLElement;
  private shouldScroll: boolean;
  private lastPosition: number;

  constructor(props: any) {
    super(props);

    this.state = {
      messages: []
    };
    this.shouldScroll = true;

    this.instantiateRoomService = this.instantiateRoomService.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.setHistoryEnd = this.setHistoryEnd.bind(this);
  }

  public render() {
    return (
      <div style={{overflow: "auto", height: "268px", minHeight: "268px", maxHeight: "268px"}} onScroll={this.handleScroll}>
        {this.state.messages}
        <div style={{float: "left", clear: "both"}}
          ref={this.setHistoryEnd} />
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
    // History receives a new message. Send the message and flag to scroll
    // to the bottom of the component.
    this.roomService.pushMessage({userFrom: this.props.username, message: nextProps.pushMessage});
    this.shouldScroll = true;
  }

  public componentDidUpdate(prevProps, prevState) {
    this.scrollToBottom();
  }

  private createMessage(data, user) {
    const index = this.state.messages.length + 1;

    // Fix the top and bottom margins to distinguish between message but
    // be conservative with spacing.
    const listGroupStyle = {
      marginBottom: "3px",
      marginTop: "3px"
    };

    return (
      <ListGroup key={index + data.userFrom + data.message} style={listGroupStyle}>
        <Message username={data.userFrom}
          message={data.message} />
      </ListGroup>
    );
  }

  private setHistoryEnd(historyEnd) {
    this.historyEnd = historyEnd;
  }

  private instantiateRoomService(props) {
    this.setState({messages: []});

    // Set up RoomService.
    this.roomService = new RoomService(props.url, (data, user) => {
      this.setState((prevState, nextProps) => {
        prevState.messages.push(this.createMessage(data, user));
        return prevState;
      });
    });
  }

  private scrollToBottom() {
    const historyEndNode = ReactDOM.findDOMNode(this.historyEnd);
    historyEndNode.scrollIntoView({behavior: "smooth"});
  }

  private handleScroll(event) {
    if (this.lastPosition > event.currentTarget.scrollTop) {
      this.shouldScroll = false;
    }
    this.lastPosition = event.currentTarget.scrollTop;
  }
}

export default ChatHistory;
