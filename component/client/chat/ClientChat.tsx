import * as React from "react";
import {Panel} from "react-bootstrap";
import {room} from "../backgroundContext";
import ChatHistory from "./ChatHistory";
import IData from "./IData";
import Messenger from "./Messenger";

interface IClientChatState {
  messages: IData[];
}

interface IClientChatProps {
  username: string;
  url: string;
  userID: string;
}

class ClientChat extends React.Component<IClientChatProps, IClientChatState> {
  private messenger: JSX.Element;

  constructor(props: IClientChatProps) {
    super(props);

    this.handleSend = this.handleSend.bind(this);
    this.messenger = <Messenger handleSend={this.handleSend}/>;
    this.updateRoomService(this.props.url);
  }

  public componentWillReceiveProps(nextProps: IClientChatProps): void {
    if (nextProps.url !== this.props.url) this.updateRoomService(nextProps.url);
  }

  public componentWillUnmount(): void {
    room.close();
  }

  public render(): JSX.Element {
    return (
      <div>
        <Panel header={`Chat at  ${this.props.url}`} bsStyle="primary" footer={this.messenger}>
          <ChatHistory messages={this.state.messages} userID={this.props.userID} />
        </Panel>
      </div>
    );
  }

  private updateRoomService(url: string) {
    this.state = {
      messages : []
    };
    room.setUrl(url, (data: IData) => {
      this.setState((prevState: IClientChatState, props: IClientChatProps) => {
        const updatedMessages = prevState.messages.concat(data);
        return Object.assign({}, prevState, {messages: updatedMessages});
      });
    });
  }

  private handleSend(message: string): void {
    room.pushMessage({userFrom: this.props.username, userFromID: this.props.userID, message});
  }
}

export default ClientChat;
