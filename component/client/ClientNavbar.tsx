import * as React from "react";
import {Navbar, Nav, NavItem} from "react-bootstrap";
import * as PropTypes from "prop-types";
import IActiveKeyState from "./IActiveKeyState";

interface IClientNavbarProps {
  initialKey: string;
  handleSelection: (eventKey: string) => any;
}

class ClientNavbar extends React.Component<IClientNavbarProps, IActiveKeyState> {
  static propTypes: any = {
    handleSelection: PropTypes.func.isRequired, // parent callback to handle updating core component.
    initialKey: PropTypes.string.isRequired // initial active navigation item.
  };

  constructor(props) {
    super(props);

    this.state = {
      activeKey: this.props.initialKey
    };

    this.handleNavigation = this.handleNavigation.bind(this);
  }

  handleNavigation(eventKey) {
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

export default ClientNavbar;
