let backgroundContext : any = chrome.extension.getBackgroundPage();

export const storage = backgroundContext.BackgroundStorageService;
