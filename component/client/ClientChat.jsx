import React, {Component} from "react";
import {Panel} from "react-bootstrap";
import ClientMessenger from "./ClientMessenger.jsx";
// import RoomService from "./RoomService";

class ClientChat extends Component {

  // room: RoomService;

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        key: "1",
        message : "okkk"
      }]
    };
    // this.room = new RoomService(props.url, (message) => {
      // this.state.history.push(message);
    // });
  }

  render() {
    const messenger = <ClientMessenger />;
    // Ensure that window is 500x500px
    const bodyStyle = {
      "height": "268px",
      "minHeight": "268px",
      "maxHeight": "268px"
    };

    console.log(this.state);
    
    return (
      <div>
        <Panel header="Chat" bsStyle="primary" footer={messenger}>
          <ul style={bodyStyle}>
            {
              this.state.history.map((data)=>
                <li key="{data.key}">{data.message}</li>
              )
            }
          </ul>
        </Panel>
      </div>
    );
  }
}

export default ClientChat;
