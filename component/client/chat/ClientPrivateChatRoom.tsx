import * as React from "react";
import {storage} from "../backgroundContext";
import {NOOP_URL, NOOP_USERNAME, STORAGE_KEY_ID, STORAGE_KEY_USERNAME} from "../Constants";
import ClientChat from "./ClientChat";

interface IClientPrivateChatRoomState {
  userID: string;
  username: string;
  currentUrl: string;
}

class ClientPrivateChatRoom extends React.Component<any, IClientPrivateChatRoomState> {

  constructor() {
    super();
    this.state = {
      currentUrl: NOOP_URL,
      userID: NOOP_USERNAME,
      username: NOOP_USERNAME
    };
    storage.get(STORAGE_KEY_ID)
      .then((userID) => {
        if (userID) {
          this.setState({
            userID
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
    return <ClientChat url={this.props.match.params.url} userID={this.state.userID}  username={this.state.username}/>;
  }
}

export default ClientPrivateChatRoom;
