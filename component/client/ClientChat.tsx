import * as React from "react";
import {Panel} from "react-bootstrap";

import ClientMessenger from "./ClientMessenger";
import RoomService from "./RoomService";

class ClientChat extends React.Component<any, any> {
  private room: RoomService;

  constructor(props) {
    super(props);
    this.instantiateRoomService(props);
  }

  public componentWillUnmount() {
    this.room.close();
  }

  public componentWillReceiveProps(nextProps) {
    this.room.close();
    this.instantiateRoomService(nextProps);
  }

  public instantiateRoomService(props) {
    this.state = {
      history: []
    };
    // set up Room Service
    this.room = new RoomService(props.url, (message) => {
      this.setState((prevState, newProps) => {
        prevState.history.push(message);
        return prevState;
      });
    });
  }

  public render() {
    const messenger = <ClientMessenger sendMessage={this.room.pushMessage.bind(this.room)}/>;
    // Ensure that window is 500x500px
    const bodyStyle = {
      height: "268px",
      maxHeight: "268px",
      minHeight: "268px"
    };

    return (
      <div>
        <Panel header="Chat" bsStyle="primary" footer={messenger}>
          <ul style={bodyStyle}>
            {this.state.history.map((message, index) => <li key={index}>{message}</li>)}
          </ul>
        </Panel>
      </div>
    );
  }
}

export default ClientChat;
