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
  private unsubscribe: () => void;

  private static getCurrentTabUrl(current: string, callback) {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
      callback(tabs[0] ? tabs[0].url : current);
    });
  }

  constructor() {
    super();
    this.state = {
      currentUrl: NOOP_URL,
      userID: NOOP_USERNAME,
      username: NOOP_USERNAME
    };
  }

  public componentDidMount() {
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
    ClientIndependentChatRoom.getCurrentTabUrl(this.state.currentUrl, (url) => {
      if (url) {
        this.setState({
          currentUrl: url
        });
      }
    });

    this.handleUpdate = this.handleUpdate.bind(this);
    this.unsubscribe = storage.subscribe(this.handleUpdate);
  }

  public componentWillUnmount() {
    this.unsubscribe();
  }

  public render() {
    return <ClientChat url={this.state.currentUrl} username={this.state.username} userID={this.state.userID}/>;
  }

  private handleUpdate(data) {
    this.setState((prevState, props) => {
      return {username: (data.username && data.username.newValue) ? data.username.newValue : prevState.username};
    })
  }
}

export default ClientIndependentChatRoom;
