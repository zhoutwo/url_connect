import * as uuid from "uuid/v4";

import {IStorageService} from "../client/backgroundContext";
import {STORAGE_KEY_ID} from "../client/Constants";

const STORAGE_TYPE = "sync";

class StorageService implements IStorageService {
  private storage: chrome.storage.StorageArea;
  private status: boolean;

  constructor() {
    this.storage = chrome.storage.sync;
    this.status = false;
  }

  /**
   * Initialize the IStorageService
   * @return {Promise<any>} A promise whose resolve takes no argument, which runs after the service is fully initialized.
   */
  public initialize(): Promise<any> {
    if (this.status) {
      return Promise.resolve();
    } else {
      return new Promise((resolve) => {
        this.storage.get(STORAGE_KEY_ID, (response) => {
          // If user id is not locally stored, generate a new one.
          if (!response[STORAGE_KEY_ID]) {
            const data: any = {};
            data[STORAGE_KEY_ID] = uuid();
            this.storage.set(data, () => {
              this.status = true;
            });
          }
          resolve();
        });
      });
    }
  }

  /**
   * Clear the storage space and load with default settings
   * @return {Promise<{}>} A promise whose resolve takes no argument, which runs after defaults are set
   */
  public reset(): Promise<void> {
    return new Promise((resolve) => {
      this.initialize().then(() => {
        this.storage.get(STORAGE_KEY_ID, (data) => {
          this.storage.clear(() => {
            this.storage.set(data, resolve);
          });
        });
      });
    }) as Promise<void>;
  }

  /**
   * Retrieves the stored value for the specified key
   * @param key The key to look up
   * @return {Promise<String>} The value associated with the key; undefined if not found
   */
  public get(key: string): Promise<any> {
    return new Promise((resolve) => {
      this.initialize().then(() => {
        this.storage.get(key, (item) => {
          resolve(item[key]);
        });
      });
    });
  }

  /**
   * Sets the key-value in the storage
   * @param key The key
   * @param value The value
   * @return {Promise<{}>} A promise whose resolve takes no argument, which runs after the value is set
   */
  public set(key: string, value: any): Promise<void> {
    const data = {};
    data[key] = value;

    return new Promise((resolve) => {
      this.initialize().then(() => {
        this.storage.set(data, resolve);
      });
    }) as Promise<void>;
  }

  /**
   * Removes the key (and its associated value) from the storage
   * @param key The key to remove
   * @return {Promise<{}>} A promise whose resolve takes no argument, which runs after the key is removed
   */
  public remove(key: string): Promise<void> {
    return new Promise((resolve) => {
      this.initialize().then(() => {
        this.storage.remove(key, resolve);
      });
    }) as Promise<void>;
  }

  /**
   * Subscribes a callback to an onChanged event.
   * @param callback function that takes one parameter of data.
   * @return  zero argument function that will unsubscribe the callback.
   */
  public subscribe(callback): () => void {
    const syncListener = (data: object, area: string) => {
      if (area === STORAGE_TYPE) {
        callback(data);
      }
    };

    chrome.storage.onChanged.addListener(syncListener);

    const unsubscriber = () => {
      chrome.storage.onChanged.removeListener(syncListener);
    };

    return unsubscriber;
  }
}

export default StorageService;
