import { combineReducers } from "redux";
import { inputs, menus, modals, observers, panels } from "./components";
import { account, bookmarks } from "./data";

const rootReducer = combineReducers({ account, bookmarks, inputs, menus, modals, observers, panels });

export default rootReducer;