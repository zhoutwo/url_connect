import React, {Component} from "react";
import {Grid, Row} from "react-bootstrap";
import ClientNavbar from "./ClientNavbar.jsx";

class ClientCore extends Component {
  constructor(props) {
    super(props);

    this.components = {
      "chat": <h1> chat </h1>,
      "setting": <h1> setting </h1>
    };

    this.state = {
      renderingComponent: this.components.chat
    };

    this.handleSelection = this.handleSelection.bind(this);
  }

  handleSelection(eventKey) {
    this.setState({"renderingComponent": this.components[eventKey]});
  }

  render() {
    const coreStyle = {
      marginTop: "60px"
    };

    return (
      <Grid>
        <Row>
          <ClientNavbar handleSelection={this.handleSelection}/>
        </Row>

        <Row style={coreStyle}>
          {this.state.renderingComponent}
        </Row>
      </Grid>
    );
  }
}

export default ClientCore;
