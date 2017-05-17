import * as React from "react";
import {Button, ButtonToolbar, ControlLabel, FormControl, FormGroup} from "react-bootstrap";

import {storage} from "../backgroundContext";
import {STORAGE_KEY_INITIALIZED, STORAGE_KEY_USERNAME} from "../Constants";

interface ISettingProperty {
  original: string;
  updated: string;
}

interface IClientSettingState {
  username: ISettingProperty;
  dirty: boolean;
}

class ClientSetting extends React.Component<any, IClientSettingState> {
  constructor(props) {
    super(props);

    this.state = {
      dirty: false,
      username: {
        original: "",
        updated: ""
      }
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.reloadSettings = this.reloadSettings.bind(this);
    this.reset = this.reset.bind(this);
  }

  public componentDidMount() {
    storage.get("username").then((username: string) => {
      this.setState({
        username: {
          original: username,
          updated: ""
        }
      });
    });

    this.handleReload = this.handleReload.bind(this);
    storage.subscribe(this.handleReload);
  }

  public componentWillUnmount() {
    storage.unsubscribe(this.handleReload);
  }

  public render(): JSX.Element {
    return (
      <form id="settings" onSubmit={this.handleSubmit}>
        <FormGroup controlId="setting" validationState={this.handleValidation()}>
          <ControlLabel> Username </ControlLabel>
          <FormControl
             type="text"
             value={this.state.username.updated}
             onChange={this.handleUsernameChange}
             placeholder={this.state.username.original}
          />
        </FormGroup>

        <FormGroup>
          <ButtonToolbar>
            <Button bsStyle="primary" onClick={this.handleSubmit} disabled={!this.state.dirty}>
              Submit
            </Button>
          </ButtonToolbar>
        </FormGroup>

        <FormGroup>
          <ControlLabel> Clear Local Settings </ControlLabel>
        </FormGroup>

        <Button bsStyle="danger" onClick={this.reset}>
          Reset
        </Button>
      </form>
    );
  }

  private handleSubmit(event): void {
    event.preventDefault();

    if (this.state.dirty) {
      const updatedUsername = this.state.username.updated;
      this.setState({username: {original: "", updated: ""}}, () => {
        storage.set(STORAGE_KEY_USERNAME, updatedUsername);
      });
    }
  }

  private handleUsernameChange(event): void {
    event.preventDefault();

    const value = event.target.value;
    if (value !== undefined) {
      this.setState((prevState: IClientSettingState, props: any) => {
        const dirtyField = {dirty: value && (value !== prevState.username.original || value.length !== 0)};
        const usernameField = {username: {original: prevState.username.original, updated: value}};
        return Object.assign({}, prevState, dirtyField, usernameField);
      });
    }
  }

  private handleValidation() {
    const updated = this.state.username.updated;
    const original = this.state.username.original;

    // error if the new username is the same as the old
    if (updated === original) {
      return "error";
    } else if (updated.length > 0) {
      return "success";
    }
  }

  private handleReload(data, area: string): void {
    if (area === "sync" && data.username) {
      this.setState((prevState: IClientSettingState, props: any) => {
        const usernameField = {username: {
            original: data.username.newValue,
            updated: prevState.username.updated
          }
        };
        return Object.assign({}, prevState, usernameField);
      });
    }
  }

  private reloadSettings() {
    this.setState({
      dirty: false,
      username: {
        original: "",
        updated: ""
      }
    });
  }

  private reset() {
    storage.reset().then(() => {
      storage.set(STORAGE_KEY_INITIALIZED, "false");
      this.reloadSettings();
    });
  }
}

export default ClientSetting;
