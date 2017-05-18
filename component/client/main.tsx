import * as React from "react";
import * as ReactDOM from "react-dom";
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";
import ClientIndependentChatRoom from "./chat/ClientIndependentChatRoom";
import ClientPrivateChatRoom from "./chat/ClientPrivateChatRoom";
import {CHAT_LINK, PRIVATE_CHAT_LINK, SETTING_LINK} from "./Constants";
import ClientCore from "./core/ClientCore";
import ClientSetting from "./settings/ClientSetting";

ReactDOM.render((
  <Router>
    <ClientCore>
      <Redirect exact={true} path="/" to={CHAT_LINK} />
      <Route path={CHAT_LINK} component={ClientIndependentChatRoom} />
      <Route path={`${PRIVATE_CHAT_LINK}/:url`} component={ClientPrivateChatRoom} />
      <Route path={SETTING_LINK} component={ClientSetting} />
    </ClientCore>
  </Router>),   document.getElementById("root"));
