import * as React from "react";
import {Nav, Navbar, NavItem} from "react-bootstrap";

import IActiveKeyState from "./IActiveKeyState";

interface IClientNavbarProps {
  initialKey: string;
  handleSelection: (eventKey: string) => any;
}

class ClientNavbar extends React.Component<IClientNavbarProps, IActiveKeyState> {
  constructor(props: IClientNavbarProps) {
    super(props);

    this.state = {
      activeKey: this.props.initialKey
    };

    this.handleNavigation = this.handleNavigation.bind(this);
  }

  public handleNavigation(eventKey: any): void {
    this.props.handleSelection(eventKey);
    this.setState({activeKey: eventKey});
  }

  public render(): JSX.Element {
    return (
      <Navbar fluid={true} fixedTop={true}>
        <Nav bsStyle="pills" activeKey={this.state.activeKey}
        onSelect={this.handleNavigation}>
          <NavItem eventKey="chat"> Chat </NavItem>
          <NavItem eventKey="setting"> Settings </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default ClientNavbar;
