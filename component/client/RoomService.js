import * as firebase from "firebase";

export default class RoomService {
  ref : firebase.database.Reference

  constructor(url, onMessagePosted) {
    console.log(url);
    url = url.replace(/[\\.]/g, ",");
    console.log(url);
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
    this.ref.push().set(message);
  }

  close() {
    this.ref.close();
  }

}