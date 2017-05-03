import * as firebase from "firebase";
import * as React from "react";
import * as ReactDOM from "react-dom";

import {Store} from "react-chrome-redux";
import {connect, Provider} from "react-redux";
import {BrowserRouter as Redirect, Route, Router} from "react-router-dom";

import ClientChat from "./client/core/ClientChat";
import ClientCore from "./client/core/ClientCore";
import ClientSetting from "./client/core/ClientSetting";

import * as Constants from "./Constants";
import {SWITCH_ROOM} from "./redux/action/Types";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBakHeV8lMlysuBRtIWU9vz_hv6dF_zHxM",
  authDomain: "url-connet.firebaseapp.com",
  databaseURL: "https://url-connet.firebaseio.com",
  messagingSenderId: "1089725560944",
  projectId: "url-connet",
  storageBucket: "url-connet.appspot.com"
};
firebase.initializeApp(config);

// Proxy Store.
const store = new Store({portName: Constants.PORT_NAME});

const mapStateToPropsClientChat = (state) => {
  console.log("[ INFO ] : Provider url", state.url);
  return {
    url: state.url,
    username: "url_connect_dev" // TODO: hook up with store.
  };
};

const mapDispatchToPropsClientChat = (dispatch) => {
  return {
    switchRoom: (url) => dispatch({type: SWITCH_ROOM, url})
  };
};

const ClientChatConnect = connect(mapStateToPropsClientChat, mapDispatchToPropsClientChat)(ClientChat);

store.ready()
  .then(() => {
    const App = (
      <Provider store={store}>
        <Router>
          <ClientCore>
            <Redirect exact={true} path="/" to={Constants.CHAT_LINK} />
            <Route path={Constants.CHAT_LINK} component={ClientChatConnect} />
            <Route path={Constants.SETTING_LINK} component={ClientSetting} />
          </ClientCore>
        </Router>
      </Provider>
    );
    ReactDOM.render(App, document.getElementById("root"));
  });

const storageService = (chrome.extension.getBackgroundPage() as any).BackgroundStorageService;

storageService.get("id").then((item) => {
  console.log(item);
});
