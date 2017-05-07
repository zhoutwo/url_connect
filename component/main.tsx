import * as React from "react";
import * as ReactDOM from "react-dom";

import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";

import ClientCore from "./client/core/ClientCore";
import ClientIndependentChatRoom from "./client/core/ClientIndependentChatRoom";
import ClientSetting from "./client/core/ClientSetting";

import * as Constants from "./Constants";

ReactDOM.render((
  <Router>
    <ClientCore>
      <Redirect exact={true} path="/" to={Constants.CHAT_LINK} />
      <Route path={Constants.CHAT_LINK} component={ClientIndependentChatRoom} />
      <Route path={Constants.SETTING_LINK} component={ClientSetting} />
    </ClientCore>
  </Router>),   document.getElementById("root"));

const storageService = (chrome.extension.getBackgroundPage() as any).BackgroundStorageService;

storageService.get("id").then((item) => {
  console.log(item);
});
