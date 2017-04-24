import * as React from "react";
import {Col, Grid, ListGroupItem, Row} from "react-bootstrap";

interface IMessageProps {
  username: string;
  message: string;
}

class Message extends React.Component<IMessageProps, any> {
  constructor(props: IMessageProps) {
    super(props);
  }

  // Then we'll use the int and convert to hex.
  // Source: https://www.designedbyaturtle.co.uk/2014/convert-string-to-hexidecimal-colour-with-javascript-vanilla/
  private hashCode(str: string): number {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
  }

  // Convert an int to hexadecimal with a max length
  // of six characters.
  // Source: https://www.designedbyaturtle.co.uk/2014/convert-string-to-hexidecimal-colour-with-javascript-vanilla/
  private intToARGB(i: number): string {
      var hex = ((i >> 24) & 0xFF).toString(16) +
              ((i >> 16) & 0xFF).toString(16) +
              ((i >> 8) & 0xFF).toString(16) +
              (i & 0xFF).toString(16);
      // Sometimes the string returned will be too short so we
      // add zeros to pad it out, which later get removed if
      // the length is greater than six.
      hex += '000000';
      return hex.substring(0, 6);
  }

  private invertColor(hexColor) {
    let color = hexColor;
    color = color.substring(1);           // remove #
    color = parseInt(color, 16);          // convert to integer
    color = 0xFFFFFF ^ color;             // invert three bytes
    color = color.toString(16);           // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color;                  // prepend #
    return color;
}

  public render(): JSX.Element {
    let backgroundColor = "#" + this.intToARGB(this.hashCode(this.props.username));
    let fontColor = this.invertColor(backgroundColor);
    const messageStyle = {
      backgroundColor: backgroundColor,
      color: fontColor
    };

    return (
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
    );
  }
}

export default Message;
