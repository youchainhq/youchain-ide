import _ from "lodash";
import React, { Component } from "react";
import classnames from "classnames";
import copy from 'copy-to-clipboard';
import * as actions from "../../actions";
import { getLocalStorage } from "../../common/utils";

import LeftPanel from "../../components/app/leftPanel";
import CenterPanel from "../../components/app/centerPanel";
import RightPanel from "../../components/app/rightPanel";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    this.state = {
      leftHidden:false,
      rightHidden:false,
      leftWidth:winWidth * 0.15,
      centerWidth:winWidth * 0.55,
      rightWidth:winWidth * 0.3,
      editorHeight:winHeight * 0.6 - 100,
      terminalHeight:winHeight * 0.4 - 30
    };

    this.onCopy = this.onCopy.bind(this);
    this.onWalletInstall = this.onWalletInstall.bind(this);
    this.onResize = this.onResize.bind(this);

    this.onMouseDownLeft = this.onMouseDownLeft.bind(this);
    this.onMouseMoveLeft = this.onMouseMoveLeft.bind(this);
    this.onMouseUpLeft = this.onMouseUpLeft.bind(this);

    this.onMouseDownRight = this.onMouseDownRight.bind(this);
    this.onMouseMoveRight = this.onMouseMoveRight.bind(this);
    this.onMouseUpRight = this.onMouseUpRight.bind(this);

    this.onToggleSide = this.onToggleSide.bind(this);
    this.onToggleTerminal = this.onToggleTerminal.bind(this);

    this.onSwitchFile = this.onSwitchFile.bind(this);
    this.onCloseFile = this.onCloseFile.bind(this);
    this.onModifyFile = this.onModifyFile.bind(this);
    this.onAddFile = this.onAddFile.bind(this);
    this.onRemoveFile = this.onRemoveFile.bind(this);
    this.onSaveFile = this.onSaveFile.bind(this);
    this.onAutoSaveFile = this.onAutoSaveFile.bind(this);
    this.onOverwriteFile = this.onOverwriteFile.bind(this);
    this.updateSettings = this.updateSettings.bind(this);

    this.onConsole = this.onConsole.bind(this);
  }

  componentWillMount() {
    const data = getLocalStorage();
    this.props.actions.initStore(data);
  }

  componentDidMount() {
    window.addEventListener("resize",this.onResize);
    window.addEventListener("keydown",(e)=>{
      if ((e.metaKey || e.ctrlKey) && e.keyCode === 83) {
        e.preventDefault();

        this.onAutoSaveFile();
      }
    });

    _.delay(()=>{
      const {app:{settings}} = this.props.state;

      if(settings && settings.autoCompile && this.refs.right){
        this.refs.right.onCompile();
      }
    },500);
  }

  componentWillReceiveProps(props) {
    const { ui: { type, request,meta },app } = props.state;

    switch (type) {
      case actions.types.REQUEST_SUCCESSFUL:
        this.requestDidSuccess(request, app,meta);
        break;
      case actions.types.REQUEST_FAILED:
        this.requestDidFailed(request, app,meta);
        break;
      default:
        break;
    }
  }

  requestDidSuccess(type, data,meta) {
    const {fileData,currentFile,opened,settings} = data;

    if(type === actions.types.SWITCH_FILE){
      localStorage.setItem("sol:currentFile",currentFile.name);
      localStorage.setItem("sol:opened",JSON.stringify(opened));

      if(this.refs.right){
        this.refs.right.onClearDeploy();
      }
    }
    else if(type === actions.types.CLOSE_FILE){
      localStorage.setItem("sol:currentFile",currentFile.name);
      localStorage.setItem("sol:opened",JSON.stringify(opened));

      if(currentFile && meta && currentFile.name !== meta.name){
        if(this.refs.right){
          this.refs.right.onClearDeploy();
        }

        this.autoCompile();
      }
    }
    else if(type === actions.types.MODIFY_FILE ||
      type === actions.types.ADD_FILE ||
      type === actions.types.REMOVE_FILE){
      localStorage.setItem("sol:files",JSON.stringify(fileData));
      localStorage.setItem("sol:currentFile",currentFile.name);
      localStorage.setItem("sol:opened",JSON.stringify(opened));

      if(type === actions.types.ADD_FILE){
        if(this.refs.right){
          this.refs.right.onClearDeploy();
        }

        if(currentFile.content){
          this.autoCompile();
        }
      }
      else if(type === actions.types.REMOVE_FILE){
        if(currentFile && meta && currentFile.name !== meta.name){
          if(this.refs.right){
            this.refs.right.onClearDeploy();
          }

          this.autoCompile();
        }
      }
    }
    else if(type === actions.types.SAVE_FILE){
      localStorage.setItem("sol:files",JSON.stringify(fileData));

      this.autoCompile();
    }
    else if(type === actions.types.OVERWRITE_FILE){
      localStorage.setItem("sol:files",JSON.stringify(fileData));
      localStorage.setItem("sol:currentFile",currentFile.name);
    }
    else if(type === actions.types.UPDATE_SETTINGS){
      localStorage.setItem("sol:settings",JSON.stringify(settings));

      this.autoCompile();
    }
  }

  requestDidFailed(type, data) {

  }

  onCopy(value,text){
    copy(String(value));

    this.props.onShowMsg(text || "复制成功","success");
  }

  onWalletInstall(){
    this.props.onShowMsg("请先安装 YOUWallet 插件","warning");
  }

  onResize(){
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    const {leftWidth,centerWidth,rightWidth} = this.state;
    const total = leftWidth + centerWidth + rightWidth;

    this.setState({
      leftWidth: winWidth * leftWidth / total,
      centerWidth: winWidth * centerWidth / total,
      rightWidth: winWidth * rightWidth / total,
      editorHeight:winHeight * 0.6 - 100,
      terminalHeight:winHeight * 0.4 - 30
    });
  }

  onMouseDownLeft(e){
    e.preventDefault();
    document.addEventListener("mousemove",this.onMouseMoveLeft);
    document.addEventListener('mouseup', this.onMouseUpLeft);
  }

  onMouseUpLeft(e){
    e.preventDefault();
    document.removeEventListener("mousemove",this.onMouseMoveLeft);
    document.removeEventListener("mouseup",this.onMouseUpLeft);
  }

  onMouseMoveLeft(e){
    e.preventDefault();

    const {leftWidth,centerWidth} = this.state;

    const contentWidth = centerWidth - (e.pageX - leftWidth);

    if(contentWidth > 50){
      this.setState({
        leftWidth:e.pageX,
        centerWidth:contentWidth
      });
    }
  }

  onMouseDownRight(e){
    e.preventDefault();
    document.addEventListener("mousemove",this.onMouseMoveRight);
    document.addEventListener('mouseup', this.onMouseUpRight);
  }

  onMouseUpRight(e){
    e.preventDefault();
    document.removeEventListener("mousemove",this.onMouseMoveRight);
    document.removeEventListener("mouseup",this.onMouseUpRight);
  }

  onMouseMoveRight(e){
    e.preventDefault();

    const {leftWidth} = this.state;
    const rightWidth = window.innerWidth - e.pageX;
    const contentWidth = window.innerWidth - leftWidth - rightWidth;

    if(contentWidth > 50){
      this.setState({
        rightWidth:rightWidth,
        centerWidth:contentWidth
      });
    }
  }

  onToggleSide(side){
    const {leftHidden,rightHidden,leftWidth,centerWidth,rightWidth} = this.state;

    switch (side) {
      case "left":
        if(leftHidden){
          this.setState({
            leftHidden:false,
            centerWidth:centerWidth - leftWidth
          });
        }
        else{
          this.setState({
            leftHidden:true,
            centerWidth:centerWidth + leftWidth
          });
        }
        break;
      case "right":
        if(rightHidden){
          this.setState({
            rightHidden:false,
            centerWidth:centerWidth - rightWidth
          });
        }
        else{
          this.setState({
            rightHidden:true,
            centerWidth:centerWidth + rightWidth
          });
        }
        break;
    }
  }

  onToggleTerminal(open){
    const {editorHeight,terminalHeight} = this.state;

    if(open){
      this.setState({
        editorHeight: editorHeight + terminalHeight
      });
    }
    else{
      this.setState({
        editorHeight: editorHeight - terminalHeight
      });
    }
  }

  onSwitchFile(targetFile){
    const content = this.refs.center.getContent();
    this.onSaveFile(content);

    _.delay(()=>{
      this.props.actions.switchFile(targetFile);
    },300);
  }

  onCloseFile(targetFile){
    this.props.actions.closeFile(targetFile,targetFile);
  }

  onModifyFile(oldName,newName){
    this.props.actions.modifyFile({
      oldName,
      newName
    });
  }

  onAddFile(name,content = ""){
    this.props.actions.addFile({
      name,
      content
    });
  }

  onRemoveFile(name){
    this.props.actions.removeFile({name},{name});
  }

  onSaveFile(content = ""){
    this.props.actions.saveFile({
      content
    });
  }

  onAutoSaveFile(){
    const content = this.refs.center.getContent();
    this.onSaveFile(content);
  }

  onOverwriteFile(data){
    const {app:{currentFile}} = this.props.state;

    this.props.actions.overwriteFile({
      data
    });

    if(currentFile.name === data.name){
      _.delay(()=>{
        this.refs.center.setContent(data.content);
      },500);
    }
  }

  updateSettings(data){
    this.props.actions.updateSettings(data);
  }

  onConsole(data){
    this.refs.center.onConsole(data);
  }

  autoCompile(){
    _.delay(()=>{
      const {app:{settings}} = this.props.state;
      if(settings.autoCompile && this.refs.right){
        this.refs.right.onCompile();
      }
    },1000);
  }

  render() {
    const {app:{fileData,currentFile,opened,settings}} = this.props.state;
    const winHeight = window.innerHeight;

    const {
      leftHidden,
      rightHidden,
      leftWidth,
      centerWidth,
      rightWidth,
      editorHeight,
      terminalHeight
    } = this.state;

    const leftClass = classnames({
      "hidden": !!leftHidden
    });

    const rightClass = classnames({
      "hidden": !!rightHidden
    });

    return (
      <div className="page" style={{height:winHeight}}>
        {
          !leftHidden ? <div
            className="dragbar left"
            style={{left:leftWidth + 8}}
            onMouseDown={this.onMouseDownLeft}
          /> : null
        }
        {
          !rightHidden ? <div
            className="dragbar right"
            style={{right:rightWidth + 8}}
            onMouseDown={this.onMouseDownRight}
          /> : null
        }
        <section className={leftClass} style={{width:leftWidth}}>
          <LeftPanel
            fileData={fileData}
            currentFile={currentFile}
            onSwitchFile={this.onSwitchFile}
            onModifyFile={this.onModifyFile}
            onAddFile={this.onAddFile}
            onRemoveFile={this.onRemoveFile}
            onOverwriteFile={this.onOverwriteFile}
          />
        </section>
        <section style={{width:centerWidth}}>
          <CenterPanel
            ref="center"
            fileData={fileData}
            currentFile={currentFile}
            opened={opened}
            editorHeight={editorHeight}
            terminalHeight={terminalHeight}
            leftHidden={leftHidden}
            rightHidden={rightHidden}
            onToggleSide={this.onToggleSide}
            onToggleTerminal={this.onToggleTerminal}
            onSwitchFile={this.onSwitchFile}
            onCloseFile={this.onCloseFile}
          />
        </section>
        <section className={rightClass} style={{width:rightWidth}}>
          <RightPanel
            ref="right"
            version={this.props.version}
            fileData={fileData}
            currentFile={currentFile}
            settings={settings}
            onCopy={this.onCopy}
            onShowMsg={this.props.onShowMsg}
            onWalletInstall={this.onWalletInstall}
            updateSettings={this.updateSettings}
            onConsole={this.onConsole}
            onAutoSaveFile={this.onAutoSaveFile}
            onClearBeforeUnload={this.props.onClearBeforeUnload}
          />
        </section>
      </div>
    );
  }
}
