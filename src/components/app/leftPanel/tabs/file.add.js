import _ from "lodash";
import React, { PureComponent } from "react";

import {Modal,Input} from "../../../../components/vendors";

export default class FileAdd extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      name:props.defaultValue || ""
    };

    this.onInputName = this.onInputName.bind(this);
    this.onValidate = this.onValidate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onInputName(e){
    this.setState({
      name:e.target.value
    });
  }

  onValidate(){
    const {fileData} = this.props;

    const {name} = this.state;

    let fileName = "";

    if(_.endsWith(name,".sol")){
      fileName = name;
    }
    else{
      fileName = `${name}.sol`;
    }

    if(_.find(fileData,["name",fileName])){
      return {
        ret:false,
        msg:"文件名已存在"
      }
    }

    if(name){
      if(/(.*)(\/).*/.test(name)){
        return {
          ret:false,
          msg:"文件名包含特殊字符"
        }
      }

      return {
        ret:true
      }
    }
    else{
      return {
        ret:false
      }
    }
  }

  onSubmit(){
    const {onConfirm} = this.props;
    const {name} = this.state;

    const vr = this.onValidate();

    if(vr.ret){
      let fileName = "";

      if(_.endsWith(name,".sol")){
        fileName = name;
      }
      else{
        fileName = `${name}.sol`;
      }

      onConfirm && onConfirm(fileName);
    }
  }

  render() {
    const {defaultValue,onDismiss} = this.props;

    return (
      <Modal
        title={"添加文件"}
        defaultValue={defaultValue}
        onDismiss={onDismiss}
        onConfirm={this.onSubmit}
      >
        <p>文件名</p>
        <Input
          type="text"
          placeholder="Untitled.sol"
          value={this.state.name}
          onChange={this.onInputName}
          onValidate={this.onValidate}
        />
      </Modal>
    );
  }
}