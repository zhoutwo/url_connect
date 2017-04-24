import {initializeApp} from "firebase";
import * as React from "react";
import * as ReactDOM from "react-dom";

import ClientCore from "./client/core/ClientCore";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBakHeV8lMlysuBRtIWU9vz_hv6dF_zHxM",
  authDomain: "url-connet.firebaseapp.com",
  databaseURL: "https://url-connet.firebaseio.com",
  messagingSenderId: "1089725560944",
  projectId: "url-connet",
  storageBucket: "url-connet.appspot.com"
};
initializeApp(config);

ReactDOM.render(<ClientCore />, document.getElementById("root"));
