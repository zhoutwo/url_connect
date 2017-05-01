import RoomService from "../../client/service/RoomService";
import * as Types from "../action/Types";
import {UNDEFINED_STATUS} from  "../../Constants";

const ClientReducer = (state = {url: "http://www.google.com", status: UNDEFINED_STATUS}, action) => {
  switch (action.type) {
    case Types.SWITCH_ROOM_PENDING:
      // This should never happen.
      return Object.assign({}, state, {status: action.type});
    case Types.SWITCH_ROOM_FAIL:
      // This should never happen. Chrome does not specify if an error is ever reported.
      return Object.assign({}, state, {status: action.type, error: action.error});
    case Types.SWITCH_ROOM_PASS:
      return Object.assign({}, state, {status: action.type, url: action.url});
    // TODO: Add cases for persistant data request and sending.
    default:
      return state;
  }
}

export default ClientReducer;
