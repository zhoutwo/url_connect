import * as React from "react";
import {Button, FormControl, FormGroup, Grid, Modal, Row} from "react-bootstrap";

import {storage} from "../backgroundContext";
import {STORAGE_KEY_INITIALIZED, STORAGE_KEY_USERNAME} from "../Constants";
import ClientNavbar from "./ClientNavbar";

interface ClientCoreState {
  activeKey: string;
  initialized: boolean;
  username: string;
}

class ClientCore extends React.Component<any, ClientCoreState> {
  constructor(props: any) {
    super(props);

    // TODO: add lifecycle to go properly set state based on persistant use. (See below.)
    // initialize the activeKey.
    this.state = {
      activeKey: "chat", // TODO: set based on redux store/persistant data?
      initialized: false,
      username: ""
    };

    // Only change initialize status if setting is found.
    storage.get(STORAGE_KEY_INITIALIZED)
      .then((hasInitalized) => {
        if (hasInitalized) this.setState({initialized: hasInitalized});
      });

    this.handleInit = this.handleInit.bind(this);
    storage.subscribe(this.handleInit);

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  public componentWillUnmount() {
    storage.unsubscribe(this.handleInit);
  }

  public render(): JSX.Element {
    // offset from the top to avoid Navbar hangovers.
    const coreStyle = {
      marginTop: "60px"
    };

    console.log("[ INFO ] : core state", this.state);

    return (
      <div>
        <Modal {... this.props} show={!this.state.initialized}>
          <Modal.Header>
            <Modal.Title>Setting Up url_connect</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={this.handleSubmit}>
              <FormGroup>
                <FormControl
                  type="text"
                  value={this.state.username}
                  onChange={this.handleUsernameChange}
                  placeholder="username"
                />
              </FormGroup>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button
              bsStyle="success"
              block={true}
              disabled={this.state.username.length === 0}
              onClick={this.handleSave}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Grid>
          <Row>
            <ClientNavbar initialKey={this.state.activeKey} />
          </Row>

          <Row style={coreStyle}>
            {this.props.children}
          </Row>
       </Grid>
     </div>
    );
  }

  private handleSubmit(event): void {
    // Force users to click the save button.
    event.preventDefault();
  }

  private handleUsernameChange(event): void {
    this.setState({username: event.target.value});
  }

  private handleSave(): void {
    storage.set(STORAGE_KEY_USERNAME, this.state.username)
      .then(storage.set(STORAGE_KEY_INITIALIZED, true)
        .then(this.setState({initialized: true, username: ""})));
  }

  private handleInit(data, area: string): void {
    console.log("[ INFO ] : firing handleInit", data);
    console.log("[ INFO ] : storage type", area);
    if (area == "sync" && data.initialized) {
      console.log("[ INFO ] : handleInit setting state", data.initialized.newValue);
      this.setState({initialized: data.initialized.newValue});
    }
  }
}

export default ClientCore;
