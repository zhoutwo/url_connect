import * as React from "react";
import {Button, FormControl, FormGroup, Grid, Modal, Panel, Row} from "react-bootstrap";
import {room, user} from "../backgroundContext";
import {NOOP_ID, NOOP_USERNAME} from "../Constants";
import ChatHistory from "./ChatHistory";
import IData from "./IData";
import Messenger from "./Messenger";

interface IClientChatState {
  incomingMessage: IData;
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

    this.state = {
      incomingMessage: {
        message: "",
        userFrom: NOOP_USERNAME,
        userFromID: NOOP_ID
      }
    };

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
            userID={this.props.userID}
            incomingMessage={this.state.incomingMessage}
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
    room.setUrl(url, (data: IData) => {
      console.log("more messages");
      this.setState({incomingMessage: data});
      // this.setState((prevState: IClientChatState, props: IClientChatProps) => {
      //   const updatedMessages = prevState.messages.concat(data);
      //   return Object.assign({}, prevState, {messages: updatedMessages});
      // });
    });
  }

  private handleSend(message: string): void {
    room.pushMessage({userFrom: this.props.username, userFromID: this.props.userID, message});
  }
}

export default ClientChat;
