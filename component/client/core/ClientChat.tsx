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
    // Ensure that window is 500x500px
    const bodyStyle = {
      height: "268px",
      maxHeight: "268px",
      minHeight: "268px"
    };

    return (
      <div>
        <Panel header="Chat" bsStyle="primary" footer={this.messenger}>
          <div style={bodyStyle} >
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
