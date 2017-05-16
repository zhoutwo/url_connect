import * as React from "react";

import ClientChat from "./ClientChat";

import * as Constants from "../Constants";

import {storage} from "../backgroundContext";

interface IClientIndependentChatRoomState {
  username: string;
  currentUrl: string;
  userID: string;
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
      username: Constants.NOOP_USERNAME,
      userID: Constants.NOOP_ID
    };
    storage.get(Constants.STORAGE_KEY_USERNAME).then((username) => {
      storage.get(Constants.STORAGE_KEY_ID).then((userID) => {
        ClientIndependentChatRoom.getCurrentTabUrl((url) => {
          this.setState({
            currentUrl: (url) ? url : Constants.NOOP_URL,
            username: (username) ? username : Constants.NOOP_USERNAME,
            userID: (userID) ? userID : Constants.NOOP_ID
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
