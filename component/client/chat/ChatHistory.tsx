import * as React from "react";
import {ListGroup} from "react-bootstrap";
import * as ReactDOM from "react-dom";

import IData from "./IData";
import Message from "./Message";

interface IHistoryProps {
  userID: string;
  incomingMessage: IData;
  startPrivateChatWith: (userID: string) => void;
}

class ChatHistory extends React.Component<IHistoryProps, any> {
  private historyEnd: HTMLElement;
  private shouldScroll: boolean;
  private lastPosition: number;
  private messages: JSX.Element[];

  constructor(props: any) {
    super(props);
    this.shouldScroll = true;
    this.messages = [];

    this.handleScroll = this.handleScroll.bind(this);
    this.setHistoryEnd = this.setHistoryEnd.bind(this);
    this.makeMessage = this.makeMessage.bind(this);
  }

  public componentWillReceiveProps(nextProps: IHistoryProps): void {
    // History receives a new message. Send the message and flag to scroll
    // to the bottom of the component.
    if (this.props.incomingMessage !== nextProps.incomingMessage) {
      this.shouldScroll = true;
      this.messages.push(this.makeMessage(nextProps.incomingMessage, this.messages.length));
    }
  }

  public componentDidUpdate(prevProps: IHistoryProps, prevState: any): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
    }
  }

  public render(): JSX.Element {
    return (
      <div style={{overflow: "auto", height: "277px", minHeight: "277px", maxHeight: "277px"}} onScroll={this.handleScroll}>
        {this.messages}
        <div style={{float: "left", clear: "both"}} ref={this.setHistoryEnd} />
      </div>
    );
  }

  private makeMessage(data, index) {
    const listGroupStyle = {
      marginBottom: "3px",
      marginTop: "3px"
    };

    return (
      <ListGroup key={index + data.userFrom + data.message} style={listGroupStyle} >
        <Message
          isMyself={this.props.userID === data.userFromID}
          userFromID={data.userFromID}
          username={data.userFrom}
          message={data.message}
          index={index}
          startPrivateChatWith={this.props.startPrivateChatWith}
        />
      </ListGroup>
    );
  }

  private setHistoryEnd(historyEnd: HTMLElement): void {
    this.historyEnd = historyEnd;
  }

  private scrollToBottom(): void {
    const historyEndNode = ReactDOM.findDOMNode(this.historyEnd);
    historyEndNode.scrollIntoView({behavior: "smooth"});
  }

  private handleScroll(event): void {
    if (this.lastPosition > event.currentTarget.scrollTop) {
      this.shouldScroll = false;
    }
    this.lastPosition = event.currentTarget.scrollTop;
  }
}

export default ChatHistory;
