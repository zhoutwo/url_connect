const backgroundContext: any = chrome.extension.getBackgroundPage();

export const storage = backgroundContext.BackgroundStorageService;
export const room = backgroundContext.room;
