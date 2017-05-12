import RoomService from "./RoomService";

// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// Code originally authored by broofa on StackOverflow
// Please see: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-2117523
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const id = generateUUID();

const defaults = {
  id,
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

  /**
   * Clear the storage space and load with default settings
   * @return {Promise<{}>} A promise whose resolve takes no argument, which runs after defaults are set
   */
  public reset(): Promise<{}> {
    return new Promise((resolve) => {
      this.storage.clear(() => {
        defaults.id = generateUUID();
        this.storage.set(defaults, resolve);
      });
    });
  }

  /**
   * Retrieves the stored value for the specified key
   * @param key The key to look up
   * @return {Promise<String>} The value associated with the key; undefined if not found
   */
  public get(key: string): Promise<string> {
    return new Promise((resolve) => {
      this.storage.get(key, (item) => {
        resolve(item[key]);
      });
    });
  }

  /**
   * Sets the key-value in the storage
   * @param key The key
   * @param value The value
   * @return {Promise<{}>} A promise whose resolve takes no argument, which runs after the value is set
   */
  public set(key: string, value: string): Promise<{}> {
    const data = {};
    data[key] = value;

    return new Promise((resolve) => {
      this.storage.set(data, resolve);
    });
  }

  /**
   * Removes the key (and its associated value) from the storage
   * @param key The key to remove
   * @return {Promise<{}>} A promise whose resolve takes no argument, which runs after the key is removed
   */
  public remove(key): Promise<{}> {
    return new Promise((resolve) => {
      this.storage.remove(key, resolve);
    });
  }
}

(window as any).backgroundStorageService = new StorageService();
(window as any).room = new RoomService(id);
