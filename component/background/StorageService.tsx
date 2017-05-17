import {IStorageService} from "../client/backgroundContext";
import {STORAGE_KEY_ID} from "../client/Constants";

class StorageService {
  private storage: chrome.storage.StorageArea;
  private STORAGE_TYPE: string = "sync";

  constructor() {
    this.storage = chrome.storage.sync;
    this.storage.get(STORAGE_KEY_ID, (id) => {
      // If user id is not locally stored, generate a new one.
      if (!id) this.storage.set({STORAGE_KEY_ID: this.generateUUID()});
    });
  }

  /**
   * Clear the storage space and load with default settings
   * @return {Promise<{}>} A promise whose resolve takes no argument, which runs after defaults are set
   */
  public reset(): Promise<{}> {
    return new Promise((resolve) => {
      this.storage.get(STORAGE_KEY_ID, (data) => {
        this.storage.clear(() => {
          this.storage.set(data, resolve);
        });
      });
    });
  }

  /**
   * Retrieves the stored value for the specified key
   * @param key The key to look up
   * @return {Promise<String>} The value associated with the key; undefined if not found
   */
  public get(key: string): Promise<any> {
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
  public set(key: string, value: any): Promise<{}> {
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
  public remove(key: string): Promise<{}> {
    return new Promise((resolve) => {
      this.storage.remove(key, resolve);
    });
  }

  /**
   * Subscribes a callback to an onChanged event.
   * @param callback function that takes one parameter of data.
   * @return  zero argument function that will unsubscribe the callback.
   */
  public subscribe(callback) {
    const syncListener = (data: object, area: string) => {
      if (area === this.STORAGE_TYPE) {
        callback(data);
      }
    };

    chrome.storage.onChanged.addListener(syncListener);

    const unsubscriber = () => {
      chrome.storage.onChanged.removeListener(syncListener);
    };

    return unsubscriber;
  }

  /*
    Code originally authored by broofa on StackOverflow
    Please see: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-2117523
  */
  private generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export default StorageService;
