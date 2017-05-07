import * as firebase from "firebase";
import {firebaseDB} from "../backgroundContext";

import IData from "./IData";

class RoomService {
  private rootRef: firebase.database.Reference;
  private messageRef: firebase.database.Reference;
  private userListRef: firebase.database.Reference;
  private myConfRef: firebase.database.Reference;

  constructor(url: string, onMessagePosted: (data: IData, from: any) => void) {
    const cleanUrl = url.replace(/[\\.]/g, ",");
    this.rootRef = firebaseDB.ref(cleanUrl);
    this.messageRef = this.rootRef.child("message");

    // set up message reference
    this.messageRef.on("child_added", (data: any) => {
      if (!data) throw new Error("Messages should never be null");
      const val = data.val();
      this.getUser(val.fromID).then((userFrom) => {
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
    this.myConfRef = this.userListRef.push();
    this.myConfRef.set({
      userID : this.myConfRef.key // TODO: we should get a way of persistent this data, like IP address
    });
  }

  public pushMessage(data: IData): void {
    if (!data) throw new Error(`data is {data}`);
    this.messageRef.push().set({
      data,
      fromID: this.myConfRef.key
    });
  }

  // TODO: figure out how to effectively swap URL without reinstantiation.
  // public updateUrl(url: string): void {
  //   const cleanUrl = url.replace(/[\\.]/g, ",");
  //   this.messageRef.remove();
  //   this.instantiateRef(cleanUrl);
  // }

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

  public close(): void {
    this.messageRef.off();
    this.myConfRef.remove().then(() => {
      this.userListRef.once("value", (data) => {
        if (!data.val()) {
          this.rootRef.remove();
        }
      });
    });
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
