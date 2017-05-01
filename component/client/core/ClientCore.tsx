import * as React from "react";
import {Grid, Row} from "react-bootstrap";

import ClientChat from "./ClientChat";
import ClientNavbar from "./ClientNavbar";
import IActiveKeyState from "./IActiveKeyState";

class ClientCore extends React.Component<any, IActiveKeyState> {
  constructor(props: any) {
    super(props);

    // TODO: add lifecycle to go properly set state based on persistant use. (See below.)
    // initialize the activeKey.
    this.state = {
      activeKey: "chat" // TODO: set based on redux store/persistant data?
    };
  }

  public render(): JSX.Element {
    // offset from the top to avoid Navbar hangovers.
    const coreStyle = {
      marginTop: "60px"
    };

    return (
      <Grid>
        <Row>
          <ClientNavbar initialKey={this.state.activeKey}/>
        </Row>

        <Row style={coreStyle}>
          {this.props.children}
        </Row>
      </Grid>
    );
  }
}

export default ClientCore;
