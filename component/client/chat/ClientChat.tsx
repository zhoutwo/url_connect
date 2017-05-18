import * as React from "react";
import {Button, FormControl, FormGroup, Grid, Modal, Panel, Row} from "react-bootstrap";
import {room, user} from "../backgroundContext";
import ChatHistory from "./ChatHistory";
import IData from "./IData";
import Messenger from "./Messenger";

interface IClientChatState {
  messages: IData[];
}

interface IClientChatProps {
  userID: string;
  username: string;
  url: string;
}

class ClientChat extends React.Component<IClientChatProps, IClientChatState> {
  private messenger: JSX.Element;

  constructor(props: IClientChatProps) {
    super(props);

    this.handleSend = this.handleSend.bind(this);
    this.startPrivateChatWith = this.startPrivateChatWith.bind(this);
    this.listener = this.listener.bind(this);
    this.messenger = <Messenger handleSend={this.handleSend}/>;
    this.updateRoomService(this.props.url);
  }

  public componentWillReceiveProps(nextProps: IClientChatProps): void {
    if (nextProps.url !== this.props.url) this.updateRoomService(nextProps.url);
  }

  public componentWillUnmount(): void {
    room.close();
    room.removeMessageListener(this.listener);
  }

  public render(): JSX.Element {
    return (
      <div>
        <Panel header={`Chat at  ${this.props.url}`} bsStyle="primary" footer={this.messenger}>
          <ChatHistory
            userID={this.props.userID}
            messages={this.state.messages}
            startPrivateChatWith={this.startPrivateChatWith}
          />
        </Panel>
      </div>
    );
  }

  public startPrivateChatWith(userID: string) {
    const newRoom = user.getMySelf().child("privateRooms").push();
    newRoom.set(newRoom.key);
    user.getUser(userID).child("privateRooms").push().set(newRoom.key);
  }

  private updateRoomService(url: string) {
    this.state = {
      messages : []
    };

    room.setUrl(url, this.listener);
  }

  private handleSend(message: string): void {
    room.pushMessage({userFrom: this.props.username, userFromID: this.props.userID, message});
  }

  private listener(data: any): void {
    if (!data.video) {
      data = data as IData;
      this.setState((prevState: IClientChatState, props: IClientChatProps) => {
        const updatedMessages = prevState.messages.concat(data);
        return Object.assign({}, prevState, {messages: updatedMessages});
      });
    }
  }
}

export default ClientChat;
