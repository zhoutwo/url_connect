import React, {Component} from "react";
import {Panel} from "react-bootstrap";
import ClientMessenger from "./ClientMessenger.jsx";
import RoomService from "./RoomService";

class ClientChat extends Component {

  room: RoomService;

  constructor(props) {
    super(props);
    this.state = {
      history: []
    };
    // set up Room Service
    this.room = new RoomService(props.url, (message) => {
      this.setState((prevState, props) => {
        prevState.history.push(message);
        return prevState;
      });
    });
  }

  render() {
    const messenger = <ClientMessenger sendMessage={(message)=>this.room.pushMessage(message)}/>;
    // Ensure that window is 500x500px
    const bodyStyle = {
      "height": "268px",
      "minHeight": "268px",
      "maxHeight": "268px"
    };

    return (
      <div>
        <Panel header="Chat" bsStyle="primary" footer={messenger}>
          <ul style={bodyStyle}>
            {
              this.state.history.map((message)=>
                <li>{message}</li>
              )
            }
          </ul>
        </Panel>
      </div>
    );
  }
}

export default ClientChat;
