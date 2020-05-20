import _ from "lodash";
import { put, take, fork } from "redux-saga/effects";
import { types } from "../actions";
import { request } from "./common";

function* initStore(){
  yield request(types.INIT_STORE);
}

function* updateSettings(){
  yield request(types.UPDATE_SETTINGS);
}

function* switchFile(){
  yield request(types.SWITCH_FILE);
}

function* closeFile(){
  yield request(types.CLOSE_FILE);
}

function* modifyFile(){
  yield request(types.MODIFY_FILE);
}

function* addFile(){
  yield request(types.ADD_FILE);
}

function* removeFile(){
  yield request(types.REMOVE_FILE);
}

function* saveFile(){
  yield request(types.SAVE_FILE);
}

function* overwriteFile(){
  yield request(types.OVERWRITE_FILE);
}

export default function*() {
  yield fork(initStore);
  yield fork(updateSettings);
  yield fork(switchFile);
  yield fork(closeFile);
  yield fork(modifyFile);
  yield fork(addFile);
  yield fork(removeFile);
  yield fork(saveFile);
  yield fork(overwriteFile);
}
