import * as React from "react";
import {Col, Grid, ListGroupItem, Row} from "react-bootstrap";

interface IMessageProps {
  username: string;
  message: string;
}

class Message extends React.Component<IMessageProps, any> {
  constructor(props) {
    super(props);
  }

  public render() {
    const messageStyle = {
      marginBottom: "10px",
      marginTop: "10px"
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
