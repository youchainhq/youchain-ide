import { combineReducers } from "redux";
import { routerReducer as routing } from "react-router-redux";

import ui from "./ui";
import app from "./app";

const rootReducer = combineReducers({
  ui,
  app,
  routing
});

export default rootReducer;
