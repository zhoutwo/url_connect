import * as firebase from "firebase";
import thunkMiddleware from "redux-thunk";
import ClientReducer from "../redux/reducer/ClientReducer";

import {alias, wrapStore} from "react-chrome-redux";
import {applyMiddleware, createStore} from "redux";
import {createLogger} from "redux-logger";
import {PORT_NAME} from "../Constants";
import {SWITCH_ROOM, switchRoom} from "../redux/action/Types";

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

// React-Chrome-Redux specific: It intercepts an action by type and
// forwards the request to the defined function.
const aliases = {
  [SWITCH_ROOM]: switchRoom
};

// Create Redux Store.
const loggerMiddleware = createLogger();
const middleware = applyMiddleware(alias(aliases), thunkMiddleware, loggerMiddleware);
const store = createStore(ClientReducer, middleware);

// Wrap Store with React-Chrome-Redux Proxy.
wrapStore(store, {portName: PORT_NAME});

// Log data initialization.
console.log("[ INFO ] : Store initialized in background");
