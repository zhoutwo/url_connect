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

class RoomService {
  private rootRef: firebase.database.Reference;
  private messageRef: firebase.database.Reference;
  private userListRef: firebase.database.Reference;
  private myConfRef: firebase.database.Reference;
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
    this.rootRef = firebase.database().ref(cleanUrl);

    // set up message reference
    this.messageRef = this.rootRef.child("message");
    this.messageRef.on("child_added", (data: any) => {
      if (!data) throw new Error("Messages should never be null");
      const val = data.val();
      this.getUser(val.fromID)
        .then((userFrom) => {
          onMessagePosted(val.data, userFrom);
        });
    });
    this.messageRef.on("child_changed", (data: any) => {
      throw new Error("Messages should never changed");
    });
    this.messageRef.on("child_removed", (data: any) => {
      throw new Error("Messages should never be moved");
    });

    // set up configRef
    this.userListRef = this.rootRef.child("user");
    this.myConfRef = this.userListRef.child(this.id);
    this.myConfRef.set(true);

    this.active = true;
  }

  public close(): void {
    if (this.active) {
      this.messageRef.off();
      this.myConfRef.remove()
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
    this.messageRef.push().set({
      data,
      fromID: this.myConfRef.key
    });
  }

  public getUser(userID: string): Promise<any> {
    return this.getDataAtReference(this.userListRef.child(userID));
  }

  public getMySelf(): Promise<any> {
    return this.getDataAtReference(this.myConfRef);
  }

  public updateConf(confData: any): void {
    this.myConfRef.update(confData);
  }

  public setConf(confData: any): void {
    this.myConfRef.set(confData);
  }

  public getDataAtReference(reference: firebase.database.Reference): Promise<any> {
    return new Promise<any>((resolve) => {
      this.myConfRef.once("value", (data) => {
        resolve(data.val());
      });
    });
  }
}

export default RoomService;
