import React, {Component} from "react";
import {Grid, Row} from "react-bootstrap";
import ClientNavbar from "./ClientNavbar.jsx";

class ClientCore extends Component {
  constructor(props) {
    super(props);

    // setup components map.
    // TODO: add lifecycle to go properly set state based on persistant use.
    // TODO: create chat and setting components.
    this.components = {
      "chat": <h1> chat </h1>,
      "setting": <h1> setting </h1>
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
  handleSelection(eventKey) {
    this.setState({"activeKey": eventKey});
  }

  render() {
    // offset from the top to avoid Navbar hangovers.
    const coreStyle = {
      marginTop: "60px"
    };

    return (
      <Grid>
        <Row>
          <ClientNavbar handleSelection={this.handleSelection} activeKey={this.state.activeKey}/>
        </Row>

        <Row style={coreStyle}>
          {this.components[this.state.activeKey]}
        </Row>
      </Grid>
    );
  }
}

export default ClientCore;
