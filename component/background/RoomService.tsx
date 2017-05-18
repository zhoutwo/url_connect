import * as firebase from "firebase";
import {IRoomService} from "../client/backgroundContext";
import {FIREBASE_EVENT_VALUE} from "../client/Constants";

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

  constructor(private id: string) {
    this.active = false;
  }

  public setUrl(url: string, onMessagePosted: (data: any) => void) {
    this.close();

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
      onMessagePosted(val);
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
          this.userListRef.once(FIREBASE_EVENT_VALUE, (data) => {
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

}

export default RoomService;
