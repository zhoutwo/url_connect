import * as React from "react";
import {Grid, Row} from "react-bootstrap";

import ClientChat from "./ClientChat";
import ClientNavbar from "./ClientNavbar";
import IActiveKeyState from "./IActiveKeyState";

interface ICoreProps {}

class ClientCore extends React.Component<ICoreProps, IActiveKeyState> {
  constructor(props: ICoreProps) {
    super(props);

    // setup components map.
    // TODO: add lifecycle to go properly set state based on persistant use.
    // TODO: setting components.
    // TODO: replace with real username.

    // initialize the activeKey.
    this.state = {
      activeKey: "chat"
    };

    // bind helper functions.
    this.handleSelection = this.handleSelection.bind(this);
  }

  public render(): JSX.Element {
    // offset from the top to avoid Navbar hangovers.
    const coreStyle = {
      marginTop: "60px"
    };

    return (
      <Grid>
        <Row>
          <ClientNavbar handleSelection={this.handleSelection}
           initialKey={this.state.activeKey}/>
        </Row>

        <Row style={coreStyle}>
          {this.instantiate(this.state.activeKey)}
        </Row>
      </Grid>
    );
  }

  private instantiate(key: string): JSX.Element {
    switch (key) {
      case "chat":
        return <ClientChat username="url_connect_dev" url="www.google.com"/>;
      case "setting":
        return <h1> setting </h1>;
      default:
        return <div />;
    }
  }

  /*
    Callback that handles Navbar transitions.
  */
  private handleSelection(eventKey: string): void {
    this.setState({activeKey: eventKey});
  }
}

export default ClientCore;
