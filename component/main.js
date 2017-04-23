import React from "react";
import ReactDOM from "react-dom";
import ClientCore from "./client/ClientCore.jsx";
import * as firebase from "firebase";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBakHeV8lMlysuBRtIWU9vz_hv6dF_zHxM",
  authDomain: "url-connet.firebaseapp.com",
  databaseURL: "https://url-connet.firebaseio.com",
  projectId: "url-connet",
  storageBucket: "url-connet.appspot.com",
  messagingSenderId: "1089725560944"
};
firebase.initializeApp(config);

ReactDOM.render(<ClientCore />, document.getElementById("root"));
