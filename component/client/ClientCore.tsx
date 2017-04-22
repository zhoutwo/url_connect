import * as React from "react";
import {Grid, Row} from "react-bootstrap";

import ClientChat from "./ClientChat";
import ClientNavbar from "./ClientNavbar";
import IActiveKeyState from "./IActiveKeyState";

interface IClientCoreComponents {
  chat: JSX.Element;
  setting: JSX.Element;
}

class ClientCore extends React.Component<any, IActiveKeyState> {
  private components: IClientCoreComponents;

  constructor(props) {
    super(props);

    // setup components map.
    // TODO: add lifecycle to go properly set state based on persistant use.
    // TODO: setting components.
    this.components = {
      chat: <ClientChat />,
      setting: <h1> setting </h1>
    };

    // initialize the activeKey.
    this.state = {
      activeKey: "chat"
    };

    // bind helper functions.
    this.handleSelection = this.handleSelection.bind(this);
  }

  /*
    Callback that handles Navbar transitions.
  */
  public handleSelection(eventKey: string) {
    this.setState({activeKey: eventKey});
  }

  public render() {
    // offset from the top to avoid Navbar hangovers.
    const coreStyle = {
      marginTop: "60px"
    };

    return (
      <Grid>
        <Row>
          <ClientNavbar handleSelection={this.handleSelection} initialKey={this.state.activeKey}/>
        </Row>

        <Row style={coreStyle}>
          {this.components[this.state.activeKey]}
        </Row>
      </Grid>
    );
  }
}

export default ClientCore;
