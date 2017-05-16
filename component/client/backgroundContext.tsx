const backgroundContext: any = chrome.extension.getBackgroundPage();

export interface IRoomService {
  setUrl(url: string, onMessagePosted: (data: any, from: any) => void);
  close();
  pushMessage(data: any);
  getUser(userID: string);
  getMySelf();
  updateConf(confData: any);
  setConf(confData: any);
}


export interface IStorageService {
  /**
   * Clear the storage space and load with default settings
   * @return {Promise<any>} A promise whose resolve takes no argument, which runs after defaults are set
   */
  reset(): Promise<any>

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
   * @return {Promise<any>} A promise whose resolve takes no argument, which runs after the value is set
   */
  set(key: string, value: string): Promise<any>;

  /**
   * Removes the key (and its associated value) from the storage
   * @param key The key to remove
   * @return {Promise<any>} A promise whose resolve takes no argument, which runs after the key is removed
   */
  remove(key): Promise<any>;

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
};


export const storage:IStorageService = backgroundContext.backgroundStorageService;
export const room:IRoomService = backgroundContext.room;

addEventListener("unload", (event) => {
  room.close();
}, true);
