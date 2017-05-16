import * as firebase from "firebase";
import {IUserService} from "../client/backgroundContext";

const allUsers = firebase.database().ref("users");

class UserService implements IUserService {
  private myself: firebase.database.Reference;

  constructor(private id: string) {
    this.myself = allUsers.child(this.id);
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

  private getDataAtReference(reference: firebase.database.Reference): Promise<void> {
    return new Promise<void>((resolve) => {
      this.myself.once("value", (data) => {
        resolve(data.val());
      });
    });
  }
}

export default UserService;
