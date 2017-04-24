import {database} from "firebase";

class RoomService {
  private ref: firebase.database.Reference;

  constructor(url, onMessagePosted) {
    url = url.replace(/[\\.]/g, ",");
    this.ref = database().ref(url);

    this.ref.on("child_added", (data) => {
      if (!data) {
        throw new Error("Messages should never be null");
      } else {
        onMessagePosted(data.val());
      }
    });

    this.ref.on("child_changed", (data) => {
      throw new Error("Messages should never changed");
    });

    this.ref.on("child_removed", (data) => {
      throw new Error("Messages should never be moved");
    });
  }

  public pushMessage(message: string) {
    if (!message) throw new Error(`message is ${message}`);
    this.ref.push().set(message);
  }

  public close() {
    this.ref.remove();
  }
}

export default RoomService;
