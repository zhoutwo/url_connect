import * as React from "react";

import ClientChat from "./ClientChat";

import * as Constants from "../Constants";

import {storage} from "../backgroundContext";

interface IClientIndependentChatRoomState {
  currentUrl: string;
  userID: string;
  username: string;
}

class ClientIndependentChatRoom extends React.Component<any, IClientIndependentChatRoomState> {
  private static getCurrentTabUrl(callback) {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
      callback(tabs[0] ? tabs[0].url : undefined);
    });
  }

  constructor() {
    super();
    this.state = {
      currentUrl: Constants.NOOP_URL,
      userID: Constants.NOOP_ID,
      username: Constants.NOOP_USERNAME
    };
    storage.get(Constants.STORAGE_KEY_USERNAME).then((username) => {
      storage.get(Constants.STORAGE_KEY_ID).then((userID) => {
        ClientIndependentChatRoom.getCurrentTabUrl((url) => {
          this.setState({
            currentUrl: (url) ? url : Constants.NOOP_URL,
            userID: (userID) ? userID : Constants.NOOP_ID,
            username: (username) ? username : Constants.NOOP_USERNAME
          });
        });
      });
    });
  }

  public render() {
    return <ClientChat url={this.state.currentUrl} username={this.state.username} userID={this.state.userID}/>;
  }
}

export default ClientIndependentChatRoom;
