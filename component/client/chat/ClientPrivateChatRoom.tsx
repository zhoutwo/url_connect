import * as React from "react";
import {storage} from "../backgroundContext";
import {NOOP_URL, NOOP_USERNAME, STORAGE_KEY_ID, STORAGE_KEY_USERNAME} from "../Constants";
import ClientChat from "./ClientChat";

interface IClientPrivateChatRoomState {
  userId: string;
  username: string;
  currentUrl: string;
}

class ClientPrivateChatRoom extends React.Component<any, IClientPrivateChatRoomState> {

  constructor() {
    super();
    this.state = {
      currentUrl: NOOP_URL,
      userId: NOOP_USERNAME,
      username: NOOP_USERNAME
    };
    storage.get(STORAGE_KEY_ID)
      .then((userId) => {
        if (userId) {
          this.setState({
            userId
          });
        }
      });
    storage.get(STORAGE_KEY_USERNAME)
      .then((username) => {
        if (username) {
          this.setState({
            username
          });
        }
      });
  }

  public render() {
    return <ClientChat url={this.props.match.params.url} userId={this.state.userId}  username={this.state.username}/>;
  }
}

export default ClientPrivateChatRoom;
