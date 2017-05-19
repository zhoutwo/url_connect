import * as React from "react";
import {Col, Grid, ListGroupItem, Row} from "react-bootstrap";
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";
import {storage} from "../backgroundContext";

interface IMessageProps {
  isMyself: boolean;
  userFromID: string;
  username: string;
  message: string;
  index: number;
  startPrivateChatWith: (userFromID: string) => void;
}

class Message extends React.Component<IMessageProps, any> {
  constructor(props: IMessageProps) {
    super(props);

    this.startPrivateChat = this.startPrivateChat.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
  }

  public render(): JSX.Element {
    const backgroundColor = "#" + this.intToARGB(this.hashCode(this.props.username));
    const fontColor = this.invertColor(backgroundColor);
    const messageStyle = {
      backgroundColor: `${backgroundColor}`, // FIXME: I should not need to do this to the linter.
      color: fontColor
    };
    const contextID = this.props.index + this.props.username;

    return (
      <div>
        <ContextMenuTrigger id={contextID} disable={this.props.isMyself}>
          <div onContextMenu={this.handleContextMenu}>
            <ListGroupItem bsStyle="info" style={messageStyle}>
              <Grid>
                <Row>
                  <Col sm={4} md={4}>
                    {this.props.username}
                  </Col>
                  <Col sm={8} md={8}>
                    {this.props.message}
                  </Col>
                </Row>
              </Grid>
            </ListGroupItem>
          </div>
        </ContextMenuTrigger>

        <ContextMenu id={contextID}>
          <MenuItem data={{user: this.props.username}} onClick={this.startPrivateChat}>
            Private Chat with {this.props.username}
          </MenuItem>
          <MenuItem data={{peer: this.props.userFromID}} onClick={this.startVideoChat}>
            Video Chat with {this.props.username}
          </MenuItem>
        </ContextMenu>
      </div>
    );
  }

  private startPrivateChat(event) {
    event.preventDefault();
    this.props.startPrivateChatWith(this.props.userFromID);
  }

  private startVideoChat(event, data) {
    event.preventDefault();
    storage.set("peerId", data.peer);
    // TODO: Maybe switch to video chat tab
  }

  private handleContextMenu(event) {
    if (this.props.isMyself)
      event.preventDefault();
  }

  /*
    Then we'll use the int and convert to hex.

    Source: https://www.designedbyaturtle.co.uk/2014/convert-string-to-hexidecimal-colour-with-javascript-vanilla/
  */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  /*
     Convert an int to hexadecimal with a max length of six characters.
     Source: https://www.designedbyaturtle.co.uk/2014/convert-string-to-hexidecimal-colour-with-javascript-vanilla/
  */
  private intToARGB(i: number): string {
    let hex = ((i >> 24) & 0xFF).toString(16) +
            ((i >> 16) & 0xFF).toString(16) +
            ((i >> 8) & 0xFF).toString(16) +
            (i & 0xFF).toString(16);
    // Sometimes the string returned will be too short so we
    // add zeros to pad it out, which later get removed if
    // the length is greater than six.
    hex += "000000";
    return hex.substring(0, 6);
  }

  /*
   Source: https://stackoverflow.com/questions/9600295/automatically-change-text-color-to-assure-readability
  */
  private invertColor(hexColor: string): string {
    let color = hexColor.substring(1);           // remove #
    let colorHex = parseInt(color, 16);          // convert to integer
    colorHex = 0xFFFFFF ^ colorHex;             // invert three bytes
    color = colorHex.toString(16);           // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color;                  // prepend #
    return color;
  }
}

export default Message;
