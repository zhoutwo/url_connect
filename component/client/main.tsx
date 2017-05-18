import * as React from "react";
import * as ReactDOM from "react-dom";
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";
import ClientIndependentChatRoom from "./chat/ClientIndependentChatRoom";
import ClientPrivateChatRoom from "./chat/ClientPrivateChatRoom";
import * as Constants from "./Constants";
import ClientCore from "./core/ClientCore";
import ClientSetting from "./settings/ClientSetting";

ReactDOM.render((
  <Router>
    <ClientCore>
      <Redirect exact={true} path="/" to={Constants.CHAT_LINK} />
      <Route path={Constants.CHAT_LINK} component={ClientIndependentChatRoom} />
      <Route path={`${Constants.PRIVATE_CHAT_LINK}/:url`} component={ClientPrivateChatRoom} />
      <Route path={Constants.SETTING_LINK} component={ClientSetting} />
    </ClientCore>
  </Router>),   document.getElementById("root"));
