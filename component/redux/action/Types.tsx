export const SWITCH_ROOM = "SWITCH_ROOM";
export const SWITCH_ROOM_PENDING = SWITCH_ROOM + "_PENDING";
export const SWITCH_ROOM_FAIL = SWITCH_ROOM + "_FAIL";
export const SWITCH_ROOM_PASS = SWITCH_ROOM + "_PASS";
export const DEFAULT_ROOM = "chrome";

export const switchRoomPending = () => {
  return {
    type: SWITCH_ROOM_PENDING
  };
};

export const switchRoomFail = (error) => {
  return {
    error,
    type: SWITCH_ROOM_PENDING
  };
};

export const switchRoomPass = (url) => {
  return {
    type: SWITCH_ROOM_PASS,
    url
  };
};

export const switchRoom = (action) => {
  return (dispatch) => {
    dispatch(switchRoomPending);

    // Chrome docs does not specify fail case.
    return chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
      if (tabs[0]) {
        dispatch(switchRoomPass(tabs[0].url));
      } else {
        dispatch(switchRoomPass(action.url));
      }

    });
  };
};
