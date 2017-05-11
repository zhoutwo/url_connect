import * as React from "react";
import {Col, Grid, ListGroupItem, Row} from "react-bootstrap";
import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";

interface IMessageProps {
  user: string;
  username: string;
  message: string;
  index: number;
}

class Message extends React.Component<IMessageProps, any> {
  constructor(props: IMessageProps) {
    super(props);
  }

  public render(): JSX.Element {
    const backgroundColor = "#" + this.intToARGB(this.hashCode(this.props.username));
    const fontColor = this.invertColor(backgroundColor);
    const messageStyle = {
      backgroundColor: `${backgroundColor}`, // FIXME: I should not need to do this to the linter.
      color: fontColor
    };
    const contextIdentifier = this.props.index + this.props.username;

    return (
      <div>
        <ContextMenuTrigger id={contextIdentifier} disable={this.props.user === this.props.username}>
          <div>
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

        <ContextMenu id={contextIdentifier}>
          <MenuItem data={{user: this.props.username}} onClick={this.startPrivateChat}>
            Private Chat with {this.props.username}
          </MenuItem>
        </ContextMenu>
      </div>
    );
  }

  private startPrivateChat(event, data) {
    event.preventDefault();
    console.log("[ INFO ] : Context Menu Click: ", data);
  }

  /**
    Then we'll use the int and convert to hex.

    Source: https://www.designedbyaturtle.co.uk/2014/convert-string-to-hexidecimal-colour-with-javascript-vanilla/
  **/
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  /**
     Convert an int to hexadecimal with a max length of six characters.
     Source: https://www.designedbyaturtle.co.uk/2014/convert-string-to-hexidecimal-colour-with-javascript-vanilla/
  **/
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

  /**
   Source: https://stackoverflow.com/questions/9600295/automatically-change-text-color-to-assure-readability
  **/
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
