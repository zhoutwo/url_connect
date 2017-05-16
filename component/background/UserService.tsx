import * as firebase from "firebase";
import {IUserService} from "../client/backgroundContext";

const allUsers = firebase.database().ref("users");

class UserService implements IUserService {
  private myself: firebase.database.Reference;

  constructor(private id: string) {
    this.myself = allUsers.child(this.id);
  }

  public getUser(userID: string): firebase.database.Reference {
    return allUsers.child(userID);
  }

  public getMySelf(): firebase.database.Reference {
    return this.myself;
  }

}

export default UserService;
