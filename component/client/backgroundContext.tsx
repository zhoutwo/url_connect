const backgroundContext: any = chrome.extension.getBackgroundPage();

addEventListener("unload", (event) => {
  const backgroundPage = chrome.extension.getBackgroundPage();
  if (backgroundPage) {
    room.close();
  }
}, true);

export const storage = backgroundContext.BackgroundStorageService;
export const room = backgroundContext.room;
