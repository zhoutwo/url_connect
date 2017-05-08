import * as React from "react";
import {ListGroup} from "react-bootstrap";
import * as ReactDOM from "react-dom";

import IData from "../service/IData";
import Message from "./Message";

interface IHistoryState {
}

interface IHistoryProps {
  messages: IData[];
}

class ChatHistory extends React.Component<IHistoryProps, IHistoryState> {
  private historyEnd: HTMLElement;
  private shouldScroll: boolean;
  private lastPosition: number;

  constructor(props: any) {
    super(props);
    console.log(this.props.messages);
    this.shouldScroll = true;
    this.handleScroll = this.handleScroll.bind(this);
    this.setHistoryEnd = this.setHistoryEnd.bind(this);
  }

  public render(): JSX.Element {
    const listGroupStyle = {
      marginBottom: "3px",
      marginTop: "3px"
    };
    console.log(this.props.messages);
    return (
      <div style={{overflow: "auto", height: "268px", minHeight: "268px", maxHeight: "268px"}} onScroll={this.handleScroll}>
        {
          this.props.messages.map((data, index)=>
            <ListGroup key={index + data.userFrom + data.message} style={listGroupStyle}>
              <Message username={data.userFrom} message={data.message} />
            </ListGroup>
          )
        }
        <div style={{float: "left", clear: "both"}}
          ref={this.setHistoryEnd} />
      </div>
    );
  }

  public componentWillReceiveProps(nextProps: IHistoryProps): void {
    // History receives a new message. Send the message and flag to scroll
    // to the bottom of the component.
    this.shouldScroll = true;
  }

  public componentDidUpdate(prevProps: IHistoryProps, prevState: IHistoryState): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
    }
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
