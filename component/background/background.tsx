// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

// Code originally authored by broofa on StackOverflow
// Please see: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-2117523
function generateUUID() {
  let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
  return id;
}

const defaults = {
  id: generateUUID(),
  username: "test-user",
};

class StorageService {
  storage: chrome.storage.StorageArea

  constructor() {
    this.storage = chrome.storage.sync;
    this.storage.get(defaults, (items) => {
      this.storage.set(items);
    })
  }

  reset() {
    this.storage.clear(() => {
      defaults.id = generateUUID();
      this.storage.set(defaults);
    });
  }

  get(key) {
    return new Promise((resolve) => {
      this.storage.get(key, (item) => {
        resolve(item[key]);
      });
    });
  }

  set(key, value) {
    let data = {};
    data[key] = value;
    this.storage.set(data);
  }

  remove(key) {
    this.storage.remove(key);
  }
}

window['BackgroundStorageService'] = new StorageService();
