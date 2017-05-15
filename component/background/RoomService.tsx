import * as firebase from "firebase";

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

class RoomService {
  private rootRef: firebase.database.Reference;
  private messageRef: firebase.database.Reference;
  private myself: firebase.database.Reference;
  private active: boolean;

  constructor(private id: string) {
    this.active = false;
  }

  public setUrl(url: string, onMessagePosted: (data: any, from: any) => void) {
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
      onMessagePosted(val.data, val.fromID);
    });
    this.messageRef.on("child_changed", (data: any) => {
      throw new Error("Messages should never changed");
    });
    this.messageRef.on("child_removed", (data: any) => {
      throw new Error("Messages should never be moved");
    });

    // set up configRef
    this.rootRef.child(USER).child(this.id).set(true);
    this.myself = allUsers.child(this.id);
    this.active = true;
  }

  public close(): void {
    if (this.active) {
      this.messageRef.off();
      this.rootRef.child(USER).child(this.id).remove()
        .then(() => {
          this.rootRef.child(USER).once("value", (data) => {
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
    this.messageRef.push().set({
      data,
      fromID: this.id
    });
  }

  public getUser(userID: string): Promise<any> {
    return this.getDataAtReference(allUsers.child(userID));
  }

  public getMySelf(): Promise<any> {
    return this.getDataAtReference(this.myself);
  }

  public updateConf(confData: any): void {
    this.myself.update(confData);
  }

  public setConf(confData: any): void {
    this.myself.set(confData);
  }

  public getDataAtReference(reference: firebase.database.Reference): Promise<any> {
    return new Promise<any>((resolve) => {
      this.myself.once("value", (data) => {
        resolve(data.val());
      });
    });
  }
}

export default RoomService;
