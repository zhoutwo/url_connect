import * as firebase from "firebase";

class RoomService {
  ref : firebase.database.Reference

  constructor(url, onMessagePosted) {
    url = url.replace(/[\\.]/g, ",");
    this.ref = firebase.database().ref(url);

    this.ref.on('child_added', (data) => {
      onMessagePosted(data.val());
    });

    this.ref.on('child_changed', (data) => {
      throw "Messages should never changed";
    });

    this.ref.on('child_removed', function(data) {
      throw "Messages should never be moved";
    });
  }

  pushMessage(message: string) {
    if (!message)
      throw "message is " + message;
    this.ref.push().set(message);
  }

  close() {
    this.ref.close();
  }
}

export default RoomService;
