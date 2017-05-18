import * as React from "react";
import {MenuItem, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {user} from "../backgroundContext";
import {CHAT_LINK, FIREBASE_EVENT_VALUE, PRIVATE_CHAT_LINK, SETTING_LINK} from "../Constants";

interface IClientNavbarProps {
  initialKey: string;
}

interface IActiveKeyState {
  activeKey: string;
  privateRooms: string[];
}

const PRIVATE_ROOM_REFERENCE = "privateRooms";

class ClientNavbar extends React.Component<IClientNavbarProps, IActiveKeyState> {
  private privateRoomsRef: firebase.database.Reference;

  constructor(props: IClientNavbarProps) {
    super(props);

    this.state = {
      activeKey: this.props.initialKey,
      privateRooms: []
    };

    this.handleNavigation = this.handleNavigation.bind(this);
    this.privateRoomsRef = user.getMySelf().child(PRIVATE_ROOM_REFERENCE);
  }

  public handleNavigation(eventKey: any): void {
    this.setState({activeKey: eventKey});
  }

  public componentDidMount() {
    this.privateRoomsRef.on(FIREBASE_EVENT_VALUE, (data) => {
      const privateRooms: string[] = [];
      if (data && data.val()) {
        const val = data.val();
        Object.keys(val).forEach((key) => privateRooms.push(val[key]));
      }
      this.setState({
        privateRooms
      });
    });
  }

  public render(): JSX.Element {
    const dropMenu = this.state.privateRooms.map((data, index) =>
        (
          <LinkContainer to={`${PRIVATE_CHAT_LINK}/${data}`} key={data + index}>
            <MenuItem eventKey={`privateChat:${data}`}> {data} </MenuItem>
          </LinkContainer>
        )
    );

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

  public componentWillUnmount() {
    this.privateRoomsRef.off();
  }
}

export default ClientNavbar;
