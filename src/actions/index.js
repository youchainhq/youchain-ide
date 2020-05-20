import { createAction } from "redux-actions";

export const types = {
  REQUEST_START: "REQUEST_START",
  REQUEST_SUCCESSFUL: "REQUEST_SUCCESSFUL",
  REQUEST_FAILED: "REQUEST_FAILED",
  RESET: "RESET",
  SHOW_LOADING: "SHOW_LOADING",
  CLEAR_LOADING: "CLEAR_LOADING",
  SHOW_TOAST: "SHOW_TOAST",
  CLEAR_TOAST: "CLEAR_TOAST",

  INIT_STORE:"INIT_STORE",
  UPDATE_SETTINGS:"UPDATE_SETTINGS",
  SWITCH_FILE:"SWITCH_FILE",
  CLOSE_FILE:"CLOSE_FILE",
  MODIFY_FILE:"MODIFY_FILE",
  ADD_FILE:"ADD_FILE",
  REMOVE_FILE:"REMOVE_FILE",
  SAVE_FILE:"SAVE_FILE",
  OVERWRITE_FILE:"OVERWRITE_FILE"
};

export const reset = createAction(types.RESET); // 重置数据状态
export const showLoading = createAction(types.SHOW_LOADING);
export const clearLoading = createAction(types.CLEAR_LOADING);
export const showToast = createAction(types.SHOW_TOAST);
export const clearToast = createAction(types.CLEAR_TOAST);

export const initStore = createAction(types.INIT_STORE);
export const updateSettings = createAction(types.UPDATE_SETTINGS);
export const switchFile = createAction(types.SWITCH_FILE);
export const closeFile = createAction(types.CLOSE_FILE,null,(requestData,metaData)=>{return metaData});
export const modifyFile = createAction(types.MODIFY_FILE);
export const addFile = createAction(types.ADD_FILE);
export const removeFile = createAction(types.REMOVE_FILE,null,(requestData,metaData)=>{return metaData});
export const saveFile = createAction(types.SAVE_FILE);
export const overwriteFile = createAction(types.OVERWRITE_FILE);