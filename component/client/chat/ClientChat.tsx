import * as React from "react";
import {Panel} from "react-bootstrap";

import ChatHistory from "./ChatHistory";
import Messenger from "./Messenger";
import IData from "../service/IData";
import RoomService from "../service/RoomService";

interface IClientChatState {
  messages: IData[];
}

interface IClientChatProps {
  username: string;
  url: string;
}

class ClientChat extends React.Component<IClientChatProps, IClientChatState> {
  private messenger: JSX.Element;
  private roomService: RoomService;

  constructor(props: IClientChatProps) {
    super(props);

    // By react conventions, history should be instantiated in the constructor.
    this.handleSend = this.handleSend.bind(this);
    this.messenger = <Messenger handleSend={this.handleSend}/>;
    this.updateRoomService(this.props.url);
  }

  public componentWillReceiveProps(nextProps: IClientChatProps): void {
    if (nextProps.url !== this.props.url) {
      console.log(`[ INFO ] : ChatHistory switching from ${this.props.url} to ${nextProps.url}`);
      this.updateRoomService(nextProps.url);
    }
  }

  public componentWillUnmount(): void {
    if (this.roomService) this.roomService.close();
  }

  private updateRoomService(url: string) {
    if (this.roomService)
      this.roomService.close();
    this.state = {
      messages : []
    };
    this.roomService = new RoomService(url, (data: IData, user) => {
      this.setState((prevState, props) => {
        const updatedMessages = prevState.messages.concat(data);
        return Object.assign({}, prevState, {messages: updatedMessages});
      });
    });
  }

  /* flow: messenger receives text and send event trigger -->
           handleSend is triggered and sets state -->
          setState triggers a rerender  and passes message to ChatHistory
  */
  public render(): JSX.Element {
    // TODO: remove once development completes.
    console.log("[ INFO ] : ClientChat render url", this.props.url);
    console.log("[ INFO ] : ClientChat render messages", this.state.messages);
    return (
      <div>
        <Panel header="Chat" bsStyle="primary" footer={this.messenger}>
          <ChatHistory messages={this.state.messages} />
        </Panel>
      </div>
    );
  }

  private handleSend(message: string): void {
    this.roomService.pushMessage({userFrom: this.props.username, message});
  }
}

export default ClientChat;
