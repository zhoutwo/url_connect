import * as React from "react";
import ClientChat from "./ClientChat";
import {NOOP_URL, NOOP_USERNAME, STORAGE_KEY_ID, STORAGE_KEY_USERNAME} from "../Constants";
import {storage} from "../backgroundContext";

interface IClientIndependentChatRoomState {
  userId: string;
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
    ClientIndependentChatRoom.getCurrentTabUrl((url) => {
      if (url) {
        this.setState({
          currentUrl: url
        });
      }
    });
  }

  public render() {
    return <ClientChat url={this.state.currentUrl} userId={this.state.userId} username={this.state.username}/>;
  }
}

export default ClientIndependentChatRoom;
