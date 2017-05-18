import * as firebase from "firebase";
import {IRoomService} from "../client/backgroundContext";

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

const allRooms = firebase.database().ref("rooms");
const allUsers = firebase.database().ref("users");

const MESSAGE = "message";
const USER = "user";

class RoomService implements IRoomService {
  private rootRef: firebase.database.Reference;
  private messageRef: firebase.database.Reference;
  private userListRef: firebase.database.Reference;
  private myself: firebase.database.Reference;
  private active: boolean;
  private listeners: Array<(data: any) => void>;

  constructor(private id: string) {
    this.active = false;
    this.listeners = [];
    this.addMessageListener = this.addMessageListener.bind(this);
    this.runListeners = this.runListeners.bind(this);
  }

  public setUrl(url: string, onMessagePosted: (data: any) => void) {
    this.close();
    if (this.listeners.indexOf(onMessagePosted) < 0) {
      this.listeners.push(onMessagePosted);
    }

    const cleanUrl = url.replace(/[\\.]/g, ",")
                        .replace(/[#]/g, "!")
                        .replace(/[$]/g, "@")
                        .replace(/[{]/g, "((")
                        .replace(/[}]/g, "))");

    this.rootRef = allRooms.child(cleanUrl);

    // set up message reference
    this.messageRef = this.rootRef.child(MESSAGE);
    this.messageRef.on("child_added", (data: any) => {
      if (!data) throw new Error("Messages should never be null");
      const val = data.val();
      this.runListeners(val, this.listeners.slice()); // Use a copy of the listeners array
    });
    this.messageRef.on("child_changed", (data: any) => {
      throw new Error("Messages should never changed");
    });
    this.messageRef.on("child_removed", (data: any) => {
      throw new Error("Messages should never be moved");
    });

    // set up configRef
    this.userListRef = this.rootRef.child(USER);
    this.userListRef.child(this.id).set(true);
    this.myself = allUsers.child(this.id);
    this.active = true;
  }

  public close(): void {
    if (this.active) {
      this.messageRef.off();
      this.userListRef.child(this.id).remove()
        .then(() => {
          this.userListRef.once("value", (data) => {
            if (!data.val()) {
              this.rootRef.remove();
            }
          });
        });
      this.active = false;
    }
  }

  public pushMessage(data: any): void {
    if (!data) throw new Error(`data is {data}`);
    this.messageRef.push().set(data);
  }

  public addMessageListener(listener: (message: any) => void) {
    this.listeners.push(listener);
  }

  public removeMessageListener(listener: (message: any) => void) {
    for (const l of this.listeners) {
      console.log(l);
      if (l === listener) {
        this.listeners.splice(this.listeners.indexOf(l), 1);
      }
    }
  }

  private runListeners(data: any, listeners: Array<(data: any) => void>): void {
    if (!data || data.stopPropagation || !listeners || !listeners.length) {
      return;
    } else {
      listeners[0](data);
      listeners.shift();
      return this.runListeners(data, listeners);
    }
  }
}

export default RoomService;
