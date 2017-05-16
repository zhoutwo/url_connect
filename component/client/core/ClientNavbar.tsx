import * as React from "react";
import {MenuItem, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {CHAT_LINK, SETTING_LINK, PRIVATE_CHAT} from "../Constants";

interface IClientNavbarProps {
  initialKey: string;
}

interface IActiveKeyState {
  activeKey: string;
  privateRooms: string[];
}

class ClientNavbar extends React.Component<IClientNavbarProps, IActiveKeyState> {
  constructor(props: IClientNavbarProps) {
    super(props);

    this.state = {
      activeKey: this.props.initialKey,
      privateRooms: ["link1", "link2"]
    };

    this.handleNavigation = this.handleNavigation.bind(this);
  }

  public handleNavigation(eventKey: any): void {
    this.setState({activeKey: eventKey});
  }

  public render(): JSX.Element {
    const dropMenu = this.state.privateRooms.map((data, index) =>
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
