import _ from "lodash";
import {BigNumber} from "bignumber.js";
import examples from "./example-contracts";

export function getQueryString(name){
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

export function formatFloat(value, digit = 2) {
  return parseFloat(value).toFixed(digit);
}

export function formatThousands(num) {
  if(num){
    let str = num.toString().split(".");

    if(str.length > 1){
      return `${formatThousands(str[0])}.${str[1]}`;
    }

    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
  }

  return num;
}

export function formatAddress(address,short = true,middle = false){
  if(address){
    if(address.length < 15){
      return address;
    }
    if(short){
      return `${address.substr(0,6)}...${address.substr(address.length - 4,4)}`;
    }
    else{
      const len = middle ? 8 : 12;
      return `${address.substr(0,len)}...${address.substr(address.length - len,len)}`;
    }
  }

  return "";
}

export function formatAccuracy(value,decimal = 18){
  return new BigNumber(value) / (new BigNumber(10).pow(decimal));
}

export function initLocalStorage() {
  let {fileData,opened,currentFile,settings} = getLocalStorage();

  if(_.isEmpty(fileData)){
    _.forEach(_.keys(examples),(key)=>{
      fileData.push(examples[key]);
    });
  }

  if(_.isEmpty(currentFile)){
    currentFile = fileData[0];
  }

  if(_.isEmpty(opened)){
    opened.push(currentFile.name);
  }

  if(_.isEmpty(settings)){
    settings = {
      autoCompile:false,
      enableOptimization:false,
      hideWarnings:false
    };
  }

  localStorage.setItem("sol:files",JSON.stringify(fileData));
  localStorage.setItem("sol:currentFile",currentFile.name);
  localStorage.setItem("sol:opened",JSON.stringify(opened));
  localStorage.setItem("sol:settings",JSON.stringify(settings));
}

export function getLocalStorage() {
  let fileData = [],currentFile = {},opened = [],settings = {};

  if(localStorage.getItem("sol:files")){
    fileData = JSON.parse(localStorage.getItem("sol:files"));
  }

  if(localStorage.getItem("sol:currentFile")){
    const name = localStorage.getItem("sol:currentFile");

    if(!_.isEmpty(fileData)){
      currentFile = _.find(fileData,["name",name]);
    }
  }

  if(localStorage.getItem("sol:opened")){
    opened = JSON.parse(localStorage.getItem("sol:opened"));
  }

  if(localStorage.getItem("sol:settings")){
    settings = JSON.parse(localStorage.getItem("sol:settings"));
  }

  return {
    currentFile,
    fileData,
    opened,
    settings
  }
}
