import _ from "lodash";
import {handleActions} from 'redux-actions';

const initialState = {
  fileData:[],
  currentFile:{},
  opened:[],
  settings:{
    autoCompile:false,
    enableOptimization:false,
    hideWarnings:false
  }
};

export default handleActions({
  INIT_STORE_DONE(state,action){
    return {...state,...action.payload};
  },
  UPDATE_SETTINGS_DONE(state,action){
    let settings = {...state.settings};
    settings = {
      ...settings,
      ...action.payload
    };

    return {
      ...state,
      settings
    }
  },
  SWITCH_FILE_DONE(state,action){
    const currentFile = action.payload;
    let opened = [...state.opened];
      if(_.indexOf(opened,currentFile.name) === -1){
      opened.push(currentFile.name);
    }

    return {
        ...state,
        currentFile,
        opened
    }
  },
  CLOSE_FILE_DONE(state,action){
    const targetFile = action.payload;
    let currentFile = {...state.currentFile};
    let opened = [...state.opened];

    _.remove(opened,(item)=>{
      return item === targetFile.name;
    });

    if(currentFile.name === targetFile.name){
      if(opened.length){
        currentFile = _.find(state.fileData,["name",opened[opened.length - 1]]);
      }
      else{
        currentFile = {};
      }
    }

    return {
      ...state,
      currentFile,
      opened
    }
  },
  MODIFY_FILE_DONE(state,action){
    const {oldName,newName} = action.payload;
    let currentFile = {...state.currentFile};
    let fileData = [...state.fileData];
    let opened = [...state.opened];

    if(currentFile.name === oldName){
      currentFile.name = newName;
    }

    let targetFile = _.find(fileData,["name",oldName]);
    if(targetFile){
      targetFile.name = newName;
    }

    let openIdx = _.findIndex(opened,(item)=>{
      return item === oldName;
    });
    if(openIdx > -1){
      opened[openIdx] = newName;
    }

    return {
      ...state,
      fileData,
      currentFile,
      opened
    }
  },
  ADD_FILE_DONE(state,action){
    const {name,content} = action.payload;
    const currentFile = {
      name:name,
      content:content
    };

    let fileData = [...state.fileData];
    let opened = [...state.opened];

    fileData.push(currentFile);
    opened.push(name);

    return {
      ...state,
      fileData,
      currentFile,
      opened
    }
  },
  REMOVE_FILE_DONE(state,action){
    const {name} = action.payload;

    let currentFile = {...state.currentFile};
    let fileData = [...state.fileData];
    let opened = [...state.opened];

    _.remove(fileData,["name",name]);
    _.remove(opened,(item)=>{
      return item === name;
    });

    if(currentFile.name === name){
      if(opened.length){
        currentFile = _.find(state.fileData,["name",opened[opened.length - 1]]);
      }
      else{
        currentFile = {};
      }
    }

    return {
      ...state,
      fileData,
      currentFile,
      opened
    }
  },
  SAVE_FILE_DONE(state,action){
    const {content} = action.payload;
    let currentFile = {...state.currentFile};
    currentFile.content = content;

    let fileData = [...state.fileData];
    let idx = _.findIndex(fileData,["name",currentFile.name]);
    if(idx > -1){
      fileData[idx].content = content;
    }

    return {
      ...state,
      fileData,
      currentFile
    }
  },
  OVERWRITE_FILE_DONE(state,action){
    const {data:{name,content}} = action.payload;
    let currentFile = {...state.currentFile};

    if(currentFile.name === name){
      currentFile.content = content;
    }

    let fileData = [...state.fileData];
    let idx = _.findIndex(fileData,["name",name]);
    if(idx > -1){
      fileData[idx].content = content;
    }

    return {
      ...state,
      fileData,
      currentFile
    }
  },
}, initialState);
