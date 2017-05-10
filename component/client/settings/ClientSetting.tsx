import * as React from "react";
import {Grid, Row} from "react-bootstrap";

import {storage} from "../backgroundContext";

interface ISettingProperty {
  original: string;
  updated: string;
}

interface IClientSettingState {
  username: ISettingProperty;
}

class ClientSetting extends React.Component<any, IClientSettingState> {
  constructor(props) {
    super(props);

    this.state = {
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
  }

  public render(): JSX.Element {
    return(
      <Grid>
        <form id="settings" onSubmit={this.handleSubmit}>
          <Row>
            <label>
              Username:
              <input type="text" value={this.state.username.updated} onChange={this.handleUsernameChange}/>
            </label>
          </Row>
          <Row>
            <input type="submit" value="Submit" />
          </Row>
        </form>
      </Grid>
    );
  }

  public handleSubmit(event) {
    event.preventDefault();
    let promise;
    for (const key in this.state) {
      if (this.state[key].updated !== this.state[key].original) {
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
      promise.then(() => {
        const temp = this.state;
        for (const key in temp) {
          if (temp.hasOwnProperty(key)) {
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
      });
    }
  }

  public handleUsernameChange(event) {
    event.preventDefault();
    if (event.target.value) {
      this.setState({
        username: {
          original: this.state.username.original,
          updated: event.target.value
        }
      });
    }
  }
}

export default ClientSetting;
