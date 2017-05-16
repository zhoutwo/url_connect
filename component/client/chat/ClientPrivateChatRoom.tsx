import * as React from "react";

import ClientChat from "./ClientChat";

import * as Constants from "../Constants";

import {storage} from "../backgroundContext";

interface IClientIndependentChatRoomState {
  username: string;
  currentUrl: string;
}

class ClientPrivateChatRoom extends React.Component<any, IClientIndependentChatRoomState> {
  constructor(props) {
    super(props);
    this.state = {
      currentUrl: "www.google.com",
      username: Constants.NOOP_USERNAME
    };
    storage.get("username")
      .then((username) => {
        if (username) {
          this.setState({
            username
          });
        }
      });

    console.log("Props", this.props);
  }

  public render() {
    return <ClientChat url={this.props.match.params.url} username={this.state.username}/>;
  }
}

export default ClientPrivateChatRoom;
