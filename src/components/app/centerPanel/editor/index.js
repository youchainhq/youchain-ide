import React, { PureComponent } from "react";
// import brace from "brace";
import AceEditor from "react-ace";
import 'ace-mode-solidity/build/remix-ide/mode-solidity';
import 'brace/mode/javascript';
import 'brace/mode/python';
import 'brace/mode/json';
import 'brace/theme/twilight';
import 'brace/ext/language_tools';

import configs from "../../../../common/configs";

export default class Editor extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      mode:"solidity",
      value: ""
    };

    this.getContent = this.getContent.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSwitch = this.onSwitch.bind(this);
  }

  getContent(){
    return this.state.value;
  }

  onSwitch(currentFile){
    if(currentFile){
      const mode = this.getMode(currentFile.name);
      const value = currentFile.content;

      this.setState({
        mode,
        value
      });
    }
  }

  componentWillMount() {
    const {currentFile} = this.props;

    this.onSwitch(currentFile);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(this.props.currentFile.name !== nextProps.currentFile.name){
      const {currentFile} = nextProps;

      this.onSwitch(currentFile);
    }
  }

  onChange(value){
    this.setState({
      value
    });
  }

  getMode(path) {
    if(path){
      let ext = path.indexOf('.') !== -1 ? /[^.]+$/.exec(path) : null;
      if (ext) ext = ext[0];
      return ext && configs.modes[ext] ? configs.modes[ext] : configs.modes['txt']
    }
    else{
      return "solidity";
    }
  }

  render() {
    const {fontSize,height} = this.props;
    const {mode,value} = this.state;

    return (
      <AceEditor
        mode={mode}
        value={value}
        theme="twilight"
        name="editor"
        fontSize={fontSize}
        width={"100%"}
        height={`${height}px`}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        onChange={this.onChange}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2
        }}
      />
    );
  }
}