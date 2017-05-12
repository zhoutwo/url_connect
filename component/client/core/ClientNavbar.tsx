import * as React from "react";
import {Nav, Navbar, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {CHAT_LINK, SETTING_LINK} from "../Constants";
import IActiveKeyState from "./IActiveKeyState";

interface IClientNavbarProps {
  initialKey: string;
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
    this.setState({activeKey: eventKey});
  }

  public render(): JSX.Element {
    return (
      <Navbar fluid={true} fixedTop={true}>
        <Nav bsStyle="pills" activeKey={this.state.activeKey} onSelect={this.handleNavigation}>
          <LinkContainer to={CHAT_LINK}>
            <NavItem eventKey="chat"> Chat </NavItem>
          </LinkContainer>
          <LinkContainer to={SETTING_LINK}>
            <NavItem eventKey="setting"> Settings </NavItem>
          </LinkContainer>
        </Nav>
      </Navbar>
    );
  }
}

export default ClientNavbar;
