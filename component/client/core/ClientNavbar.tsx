import * as React from "react";
import {NavDropdown, MenuItem, Nav, Navbar, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {CHAT_LINK, PRIVATE_CHAT, SETTING_LINK} from "../Constants";
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
    const dropMenu = ["link1", "room2"].map((data, index) =>
        (
          <LinkContainer to={`${PRIVATE_CHAT}/${data}`} key={data + index}>
            <MenuItem eventKey="privateChat:${data}"> {data} </MenuItem>
          </LinkContainer>
        )
    )

    return (
      <Nav bsStyle="pills" activeKey={this.state.activeKey} onSelect={this.handleNavigation}>
        <LinkContainer to={CHAT_LINK}>
          <NavItem eventKey="chat"> Chat </NavItem>
        </LinkContainer>
        <LinkContainer to={SETTING_LINK}>
          <NavItem eventKey="setting"> Settings </NavItem>
        </LinkContainer>
        <NavDropdown title="PrivateChat" id="nav-dropdown">
          {dropMenu}
        </NavDropdown>
      </Nav>
    );
  }
}

export default ClientNavbar;
