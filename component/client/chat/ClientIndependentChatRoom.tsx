import * as React from "react";
import {storage} from "../backgroundContext";
import {NOOP_URL, NOOP_USERNAME, STORAGE_KEY_ID, STORAGE_KEY_USERNAME} from "../Constants";
import ClientChat from "./ClientChat";

interface IClientIndependentChatRoomState {
  userID: string;
  username: string;
  currentUrl: string;
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
    ClientIndependentChatRoom.getCurrentTabUrl((url) => {
      if (url) {
        this.setState({
          currentUrl: url
        });
      }
    });
  }

  public render() {
    return <ClientChat url={this.state.currentUrl} username={this.state.username} userID={this.state.userID}/>;
  }
}

export default ClientIndependentChatRoom;
