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
  userId: string;
  username: string;
  url: string;
}

class ClientChat extends React.Component<IClientChatProps, IClientChatState> {
  private messenger: JSX.Element;

  constructor(props: IClientChatProps) {
    super(props);

    this.handleSend = this.handleSend.bind(this);
    this.startPrivateChatWith = this.startPrivateChatWith.bind(this);

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
          <ChatHistory
            userId={this.props.userId}
            messages={this.state.messages}
            startPrivateChatWith={this.startPrivateChatWith}
          />
        </Panel>
      </div>
    );
  }

  public startPrivateChatWith(userId: string) {
    const newRoom = user.getMySelf().child("privateRooms").push();
    newRoom.set(newRoom.key);
    user.getUser(userId).child("privateRooms").push().set(newRoom.key);
  }

  private updateRoomService(url: string) {
    this.state = {
      messages : []
    };
    room.setUrl(url, (data: IData) => {
      this.setState((prevState, props) => {
        const updatedMessages = prevState.messages.concat(data);
        return Object.assign({}, prevState, {messages: updatedMessages});
      });
    });
  }

  private handleSend(message: string): void {
    room.pushMessage({userFromId: this.props.userId, userFrom: this.props.username, message});
  }
}

export default ClientChat;
