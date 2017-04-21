import React, {Component} from "react";
import {Panel} from "react-bootstrap";
import ClientMessenger from "./ClientMessenger.jsx";

class ClientChat extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const messenger = <ClientMessenger />;
    // Ensure that window is 500x500px
    const bodyStyle = {
      "height": "268px",
      "minHeight": "268px",
      "maxHeight": "268px"
    };

    return (
      <div>
        <Panel header="Chat" bsStyle="primary" footer={messenger}>
          <div style={bodyStyle} />
        </Panel>
      </div>
    );
  }
}

export default ClientChat;
