import "./style.less";
import _ from "lodash";
import React, { PureComponent } from "react";

import {Confirm} from "../../../../components/vendors";

import Tree from "./tree";
import FileModify from "./file.modify";

export default class Files extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modify:false,
      targetType:"",
      targetName:"",
      remove:false
    };

    this.onRename = this.onRename.bind(this);
    this.onRenameConfirm = this.onRenameConfirm.bind(this);
    this.onRenameCancel = this.onRenameCancel.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onRemoveConfirm = this.onRemoveConfirm.bind(this);
    this.onRemoveCancel = this.onRemoveCancel.bind(this);
  }

  onRename(type,name){
    this.setState({
      modify:true,
      targetType:type,
      targetName:name
    });
  }

  onRenameConfirm(replaceName){
    const {onModifyFile} = this.props;
    const {targetType,targetName} = this.state;

    if(targetType === "file"){
      onModifyFile && onModifyFile(targetName,replaceName);

      _.delay(()=>{
        this.onRenameCancel();
      },100);
    }
  }

  onRenameCancel(){
    this.setState({
      modify:false,
      targetType:"",
      targetName:""
    });
  }

  onRemove(type,name){
    this.setState({
      remove:true,
      targetType:type,
      targetName:name
    });
  }

  onRemoveConfirm(){
    const {onRemoveFile} = this.props;
    const {targetType,targetName} = this.state;

    if(targetType === "file"){
      onRemoveFile && onRemoveFile(targetName);

      _.delay(()=>{
        this.onRemoveCancel();
      },100);
    }
  }

  onRemoveCancel(){
    this.setState({
      remove:false,
      targetType:"",
      targetName:""
    });
  }

  render() {
    const {
      fileData,
      currentFile,
      onSwitchFile
    } = this.props;

    const {modify,remove,targetName} = this.state;

    const data = [
      {
        name:"browser",
        files:fileData
      }
    ];

    return (
      <div className="leftpanel-files-wrapper">
        <section className="header">
          已创建的项目
        </section>
        <section className="body">
          {
            data.map((item,key)=>{
              return (
                <Tree
                  key={key}
                  data={item}
                  currentFile={currentFile}
                  onSwitchFile={onSwitchFile}
                  onRemove={this.onRemove}
                  onRename={this.onRename}
                />
              )
            })
          }
        </section>

        {
          modify ?
            <FileModify
              fileData={fileData}
              defaultValue={targetName}
              onDismiss={this.onRenameCancel}
              onConfirm={this.onRenameConfirm}
            /> : null
        }

        {
          remove ?
            <Confirm
              title={"删除文件"}
              desc={"确认要删除此文件吗？"}
              onConfirm={this.onRemoveConfirm}
              onDismiss={this.onRemoveCancel}
            /> : null
        }
      </div>
    );
  }
}