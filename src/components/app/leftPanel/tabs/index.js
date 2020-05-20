import "./style.less";
import _ from "lodash";
import React, { PureComponent } from "react";

import {Confirm} from "../../../../components/vendors";
import FileAdd from "./file.add";

export default class Tabs extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      add:false,
      overwrite:null
    };

    this.onAdd = this.onAdd.bind(this);
    this.onAddConfirm = this.onAddConfirm.bind(this);
    this.onAddCancel = this.onAddCancel.bind(this);
    this.onReadLocalFile = this.onReadLocalFile.bind(this);
  }

  onAdd(){
    this.setState({
      add:true
    });
  }

  onAddConfirm(name){
    const {onAddFile} = this.props;

    onAddFile && onAddFile(name);

    _.delay(()=>{
      this.onAddCancel();
    },100);
  }

  onAddCancel(){
    this.setState({
      add:false
    });
  }

  onReadLocalFile(e){
    const file = e.target.files[0];
    if(file){
      const fs = new FileReader();
      fs.onloadend = ()=>{
        const content = fs.result;

        const {fileData,onAddFile} = this.props;

        if(_.find(fileData,["name",file.name])){
          this.setState({
            overwrite:{
              name:file.name,
              content:content
            }
          });
        }
        else{
          onAddFile && onAddFile(file.name,content);
        }
      };
      fs.readAsText(file);
    }
  }

  render() {
    const {add,overwrite} = this.state;

    return (
      <div className="leftpanel-tabs-wrapper">
        <ul>
          <li>
            <a onClick={this.onAdd}><i className="fa icon-plus-circle"/></a>
          </li>
          <li>
            <a className="local-wrapper">
              <input type="file" accept=".sol" onChange={this.onReadLocalFile}/>
              <i className="fa icon-folder-open"/>
            </a>
          </li>
        </ul>

        {
          add ?
            <FileAdd
              fileData={this.props.fileData}
              onDismiss={this.onAddCancel}
              onConfirm={this.onAddConfirm}
            /> : null
        }

        {
          overwrite ?
            <Confirm
              title={"覆盖文件"}
              desc={"此文件已存在，确认要覆盖文件？"}
              onConfirm={()=>{
                this.setState({
                  overwrite:null
                });

                this.props.onOverwriteFile(overwrite);
              }}
              onDismiss={()=>{
                this.setState({
                  overwrite:null
                });
              }}
            /> : null
        }
      </div>
    );
  }
}