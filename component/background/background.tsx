import {STORAGE_KEY_ID} from "../client/Constants";
import RoomService from "./RoomService";
import UserService from "./UserService";
import StorageService from "./StorageService";

const backgroundService = new StorageService();
(window as any).backgroundStorageService = backgroundService;
backgroundService.get(STORAGE_KEY_ID)
  .then((id) => {
    (window as any).room = new RoomService(id);
    (window as any).user = new UserService(id);
  });
