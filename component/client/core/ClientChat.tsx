import * as React from "react";
import {Panel} from "react-bootstrap";

import ChatHistory from "../chat/ChatHistory";
import Messenger from "../chat/Messenger";

interface IClientChatState {
  pushMessage: string;
}

interface IClientChatProps {
  username: string;
  url: string;
  switchRoom: () => void;
}

class ClientChat extends React.Component<IClientChatProps, IClientChatState> {
  private messenger: JSX.Element;

  constructor(props: IClientChatProps) {
    super(props);

    this.state = {
      pushMessage: ""
    };

    this.handleSend = this.handleSend.bind(this);
    this.messenger = <Messenger handleSend={this.handleSend}/>;
  }

  public componentDidMount() {
    this.props.switchRoom();
  }

  /* flow: messenger receives text and send event trigger -->
           handleSend is triggered and sets state -->
          setState triggers a rerender  and passes message to ChatHistory
  */
  public render(): JSX.Element {
    // TODO: remove once development completes.
    console.log("[ INFO ] : ClientChat render url", this.props.url);
    return (
      <div>
        <Panel header="Chat" bsStyle="primary" footer={this.messenger}>
          <ChatHistory username={this.props.username} url={this.props.url}
          pushMessage={this.state.pushMessage} />
        </Panel>
      </div>
    );
  }

  private handleSend(message: string): void {
    this.setState({pushMessage: message});
  }
}

export default ClientChat;
