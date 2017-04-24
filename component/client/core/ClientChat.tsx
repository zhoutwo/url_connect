import * as React from "react";
import {Panel} from "react-bootstrap";
import Messenger from "../chat/Messenger";
import ChatHistory from "../chat/ChatHistory";

class ClientChat extends React.Component<any, any> {
  private messenger: JSX.Element;

  constructor(props: any) {
    super(props);

    this.messenger = <Messenger />;
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
            <ChatHistory username={this.props.username} />
          </div>
        </Panel>
      </div>
    );
  }
}

export default ClientChat;
