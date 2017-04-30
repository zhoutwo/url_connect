import * as firebase from "firebase";
import * as React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {Store} from "react-chrome-redux";
import {BrowserRouter as Router, Route} from "react-router-dom";

import {PORT_NAME} from "./Constants";
import ClientCore from "./client/core/ClientCore";
import ClientChat from "./client/core/ClientChat";
import ClientSetting from "./client/core/ClientSetting";

// Initialize Firebase
// NOTE: move to background.tsx
// const config = {
//   apiKey: "AIzaSyBakHeV8lMlysuBRtIWU9vz_hv6dF_zHxM",
//   authDomain: "url-connet.firebaseapp.com",
//   databaseURL: "https://url-connet.firebaseio.com",
//   messagingSenderId: "1089725560944",
//   projectId: "url-connet",
//   storageBucket: "url-connet.appspot.com"
// };
// firebase.initializeApp(config);

// const store = new Store({portName: PORT_NAME});

// store.ready().then(() => {
render(
  // <Provider store={store}>
  <Router>
    <ClientCore>
      <Route path="/chat" component={ClientChat} />
      <Route path="/setting" component={ClientSetting} />
    </ClientCore>
  </Router>,
  // </Provider>,
  document.getElementById("root")
);
// });

const storageService = (chrome.extension.getBackgroundPage() as any).BackgroundStorageService;

storageService.get("id").then((item) => {
  console.log(item);
});
