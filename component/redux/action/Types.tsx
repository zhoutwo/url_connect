export const SWITCH_ROOM = "SWITCH_ROOM";
export const switchRoom = (action) => {
  return (dispatch) => {
    dispatch(switchRoomPending);

    // Chrome docs does not specify fail case.
    return chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
      dispatch(switchRoomPass(tabs[0].url));
    });
  };
}

export const SWITCH_ROOM_PENDING = SWITCH_ROOM + "_PENDING";
export const switchRoomPending = () => {
  return {
    type: SWITCH_ROOM_PENDING
  };
}

export const SWITCH_ROOM_FAIL = SWITCH_ROOM + "_FAIL";
export const switchRoomFail = (error) => {
  return {
    type: SWITCH_ROOM_PENDING,
    error: error
  };
}

export const SWITCH_ROOM_PASS = SWITCH_ROOM + "_PASS";
export const switchRoomPass = (url) => {
  console.log("[ INFO ] : dispatching url ", url);
  return {
    type: SWITCH_ROOM_PASS,
    url: url
  };
}
