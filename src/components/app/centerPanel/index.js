import "./style.less";
import React, { PureComponent } from "react";

import Tabs from "./tabs";
import Actions from "./actions";
import Editor from "./editor";
import Terminal from "./terminal";

export default class CenterPanel extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      fontSize:14
    };

    this.getContent = this.getContent.bind(this);
    this.setContent = this.setContent.bind(this);
    this.onChangeFontSize = this.onChangeFontSize.bind(this);
    this.onConsole = this.onConsole.bind(this);
  }

  getContent(){
    return this.refs.editor.getContent();
  }

  setContent(value){
    this.refs.editor.onChange(value)
  }

  onChangeFontSize(value){
    const fontSize = this.state.fontSize + value;
    if(fontSize > 10){
      this.setState({
        fontSize
      });
    }
  }

  onConsole(data){
    this.refs.terminal.onSetMsg(data);
  }

  render() {
    const {
      fileData,
      currentFile,
      opened,
      editorHeight,
      terminalHeight,
      leftHidden,
      rightHidden,
      onToggleSide,
      onToggleTerminal,
      onSwitchFile,
      onCloseFile
    } = this.props;

    return (
      <div className="centerpanel-wrapper">
        <Tabs
          fileData={fileData}
          currentFile={currentFile}
          opened={opened}
          onSwitchFile={onSwitchFile}
          onCloseFile={onCloseFile}
        />
        <Actions
          leftHidden={leftHidden}
          rightHidden={rightHidden}
          onToggleSide={onToggleSide}
          onChangeFontSize={this.onChangeFontSize}
        />
        <Editor
          ref="editor"
          fontSize={this.state.fontSize}
          height={editorHeight}
          currentFile={currentFile}
        />
        <Terminal
          ref="terminal"
          height={terminalHeight}
          onToggleTerminal={onToggleTerminal}
        />
      </div>
    );
  }
}

