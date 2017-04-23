import * as React from "react";
import * as PropTypes from "prop-types";
import {Grid, Row, Col, ListGroupItem} from "react-bootstrap";

class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ListGroupItem bsStyle="info">
        <Grid>
          <Row>
            <Col sm={4} md={4} >
              {this.props.username}
            </Col>
            <Col sm={8} md={8} >
              {this.props.message}
            </Col>
          </Row>
        </Grid>
      </ListGroupItem>
    )
  }
}

Message.propTypes = {
  username: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default Message;
