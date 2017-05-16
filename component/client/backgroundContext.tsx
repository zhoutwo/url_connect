const backgroundContext: any = chrome.extension.getBackgroundPage();

export interface IRoomService {
  /**
   * set the url and callback listener.
   * @param url the url of chat room to listen for
   * @param onMessagePosted callback listener
   */
  setUrl(url: string, onMessagePosted: (data: any, from: any) => void);

  /**
   * close the room, and release the listener
   */
  close();

  /**
   * @param data the data to be sent in this room
   */
  pushMessage(data: any);
}

export interface IStorageService {
  /**
   * Clear the storage space and load with default settings
   * @return {Promise<void>} A promise whose resolve takes no argument, which runs after defaults are set
   */
  reset(): Promise<void>;

  /**
   * Retrieves the stored value for the specified key
   * @param key The key to look up
   * @return {Promise<String>} The value associated with the key; undefined if not found
   */
  get(key: string): Promise<string>;

  /**
   * Sets the key-value in the storage
   * @param key The key
   * @param value The value
   * @return {Promise<void>} A promise whose resolve takes no argument, which runs after the value is set
   */
  set(key: string, value: string): Promise<void>;

  /**
   * Removes the key (and its associated value) from the storage
   * @param key The key to remove
   * @return {Promise<void>} A promise whose resolve takes no argument, which runs after the key is removed
   */
  remove(key): Promise<void>;

  /**
   * Subscribes a callback to an onChanged event.
   * @param callback The function that takes one parameter of data.
   */
  subscribe(callback);

  /**
   * Unsubscribes a callback from the onChanged event.
   * @param callback The function that takes one parameter of data.
   */
  unsubscribe(callback);
}

export interface IUserService {
  /**
   * @param userID the userID of the user data to get
   * @return the promise for the user config of this user
   */
  getUser(userID: string): Promise<any>;

  /**
   * @return the promise for the user config of myself
   */
  getMySelf(): Promise<any>;

  /**
   * @param confData the part of configs to update
   */
  updateConf(confData: any);

  /**
   * @param confData the new configs to override existing config
   */
  setConf(confData: any);
}

export const storage: IStorageService = backgroundContext.backgroundStorageService;
export const room: IRoomService = backgroundContext.room;
export const user: IUserService = backgroundContext.user;

addEventListener("unload", (event) => {
  room.close();
}, true);
