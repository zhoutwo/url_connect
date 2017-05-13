import * as React from "react";
import {Button, ButtonToolbar, FormGroup, FormControl} from "react-bootstrap";

import {storage} from "../backgroundContext";

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

    storage.get("username").then((username) => {
      this.setState({
        username: {
          original: username,
          updated: username,
        }
      });
    });

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.reloadSettings = this.reloadSettings.bind(this);
    this.reset = this.reset.bind(this);
  }

  public render(): JSX.Element {
    // FIXME: Typescript wants some weird signature that I am not sure how to specify.
    console.log("[ INFO ] : ClientSetting state", this.state);
    return (
      <form id="settings" onSubmit={this.handleSubmit}>
        <FormGroup controlId="setting" validationState={this.handleValidation}>
          <FormControl type="text" value={this.state.username.updated} onChange={this.handleUsernameChange} placeholder={this.state.username.original} />
        </FormGroup>

        <FormGroup>
          <ButtonToolbar>
            <Button bsStyle="primary" onClick={this.handleSubmit} disabled={!this.state.dirty}>
              Submit
            </Button>
            <Button bsStyle="danger" onClick={this.reset}>
              Reset
            </Button>
          </ButtonToolbar>
        </FormGroup>
      </form>
    );
  }

  private handleSubmit(event): void {
    event.preventDefault();
    let promise;

    if (this.state.dirty) {
      const iterableKeys = Object.keys(this.state).filter((key) => key !== "dirty");
      for (const key in iterableKeys) {
        if (!promise) {
          promise = new Promise((resolve) => {
            storage.set(key, this.state[key].updated).then(resolve);
          });
        } else {
          const temp = promise;
          promise = new Promise((resolve) => {
            temp.then(() => {
              storage.set(key, this.state[key].updated).then(resolve);
            });
          });
        }
      }
    }

    if (promise) {
      promise.then(this.reloadSettings);
    } else {
      this.setState({
        dirty: false
      });
    }
  }

  private handleUsernameChange(event): void {
    event.preventDefault();
    const value = event.target.value;
    console.log("[ INFO ] : username value", value);
    if (value !== undefined) {
      this.setState((prevState: IClientSettingState, props: any) => {
        const usernameField = {username: {original: prevState.username.original, updated: value}};
        return Object.assign({}, prevState, usernameField);
      });
    }
  }

  private handleValidation() {
    const updated = this.state.username.updated;
    const original = this.state.username.original;

    // error if the new username is empty or is the same as the old
    if (updated.length === 0 || updated === original) {
      this.setState({dirty: false});
      return "error";
    }

    this.setState({dirty: true});
    return "success";
  }

  private reloadSettings() {
    this.setState({
      dirty: false
    });
    const temp = this.state;
    const iterableKeys = Object.keys(this.state).filter((key) => key !== "dirty");
    for (const key in iterableKeys) {
      storage.get(key).then((value) => {
        const data: any = {};
        data[key] = {
          original: value,
          updated: value,
        };
        this.setState(data);
      });
    }
  }

  private reset() {
    storage.reset().then(this.reloadSettings);
  }
}

export default ClientSetting;
