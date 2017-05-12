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
    // this.handleValidation = this.handleValidation.bind(this);
    this.reloadSettings = this.reloadSettings.bind(this);
    this.reset = this.reset.bind(this);
  }

  public render(): JSX.Element {
    return (
      <form id="settings" onSubmit={this.handleSubmit}>
        <FormGroup controlId="setting" >
          <FormControl type="text" value={this.state.username.updated} onChange={this.handleUsernameChange} placeholder={this.state.username.original} />
        </FormGroup>

        <FormGroup>
          <ButtonToolbar>
            <Button bsStyle="primary" onClick={this.handleUsernameChange} disabled={!this.state.dirty}>
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
    for (const key in this.state) {
      if (this.state.hasOwnProperty(key) && key !== "dirty") {
        // Updated value shouldn't be empty
        if (this.state[key].updated && this.state[key].updated !== this.state[key].original) {
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
    if (event.target.value !== undefined) {
      this.setState({
        // The field is only considered dirty if there is value and it's different from original
        dirty: event.target.value && this.state.username.original !== event.target.value,
        username: {
          original: this.state.username.original,
          updated: event.target.value
        }
      });
    }
  }

  private handleValidation() {
    const updated = this.state.username.updated;
    const original = this.state.username.original;

    // error if the new username is empty or is the same as the old
    if (updated.length === 0 || updated === original) {
      return "error";
    }

    return "success";
  }

  private reloadSettings() {
    this.setState({
      dirty: false
    });
    const temp = this.state;
    for (const key in temp) {
      if (temp.hasOwnProperty(key) && key !== "dirty") {
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
  }

  private reset() {
    storage.reset().then(this.reloadSettings);
  }
}

export default ClientSetting;
