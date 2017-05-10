const backgroundContext: any = chrome.extension.getBackgroundPage();

export const storage = backgroundContext.backgroundStorageService;
export const room = backgroundContext.room;

addEventListener("unload", (event) => {
  const backgroundPage = chrome.extension.getBackgroundPage();
  if (backgroundPage) {
    room.close();
  }
}, true);
