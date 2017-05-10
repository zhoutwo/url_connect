import * as firebase from "firebase";

// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

// Code originally authored by broofa on StackOverflow
// Please see: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-2117523
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const defaults = {
  id: generateUUID(),
  username: "test-user",
};

class StorageService {
  private storage: chrome.storage.StorageArea;

  constructor() {
    this.storage = chrome.storage.sync;
    this.storage.get(defaults, (items) => {
      this.storage.set(items);
    });
  }

  public reset(): Promise<any> {
    return new Promise((resolve) => {
      this.storage.clear(() => {
        defaults.id = generateUUID();
        this.storage.set(defaults, resolve);
      });
    });
  }

  public get(key): Promise<string> {
    return new Promise((resolve) => {
      this.storage.get(key, (item) => {
        resolve(item[key]);
      });
    });
  }

  public set(key, value): Promise<any> {
    const data = {};
    data[key] = value;

    return new Promise((resolve) => {
      this.storage.set(data, resolve);
    });
  }

  public remove(key): Promise<any> {
    return new Promise((resolve) => {
      this.storage.remove(key, resolve);
    });
  }
}

(window as any).BackgroundStorageService = new StorageService();

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

(window as any).firebaseDB = firebase.database();
