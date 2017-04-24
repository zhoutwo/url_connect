import * as React from "react";
import {Panel} from "react-bootstrap";

import ChatHistory from "../chat/ChatHistory";
import Messenger from "../chat/Messenger";

class ClientChat extends React.Component<any, any> {
  private messenger: JSX.Element;

  constructor(props: any) {
    super(props);

    // By react conventions, history should be instantiated in the constructor.
    this.state = {
      history: [],
      pushMessage: ""
    };

    this.handleSend = this.handleSend.bind(this);
    this.messenger = <Messenger handleSend={this.handleSend}/>;
  }

  public render() {
    return (
      <div>
        <Panel header="Chat" bsStyle="primary" footer={this.messenger}>
          <div style={{overflow: "auto"}}>
            <ChatHistory username={this.props.username} url={this.props.url} pushMessage={this.state.pushMessage} />
          </div>
        </Panel>
      </div>
    );
  }

  private handleSend(message: string) {
    this.setState({pushMessage: message});
  }
}

export default ClientChat;
