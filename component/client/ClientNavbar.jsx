import React, {Component} from "react";
import {Navbar, Nav, NavItem} from "react-bootstrap";
import PropTypes from "prop-types";

class ClientNavbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "activeKey": this.props.initialKey
    };

    this.handleNavigation = this.handleNavigation.bind(this);
  }

  handleNavigation(eventKey, isSynthetic) {
    this.props.handleSelection(eventKey);
    this.setState({"activeKey": eventKey});
  }

  render() {
    return (
      <Navbar fluid fixedTop>
        <Nav bsStyle="pills" activeKey={this.state.activeKey} onSelect={this.handleNavigation}>
          <NavItem eventKey="chat"> Chat </NavItem>
          <NavItem eventKey="setting"> Settings </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

ClientNavbar.propTypes = {
  handleSelection: PropTypes.func.isRequired, // parent callback to handle updating core component.
  initialKey: PropTypes.string.isRequired // initial active navigation item.
};

export default ClientNavbar;
