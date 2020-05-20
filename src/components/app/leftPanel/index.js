import "./style.less";
import React, { PureComponent } from "react";

import Tabs from "./tabs";
import Files from "./files";

export default class LeftPanel extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      fileData,
      currentFile,
      onSwitchFile,
      onModifyFile,
      onAddFile,
      onRemoveFile,
      onOverwriteFile
    } = this.props;

    return (
      <div className="leftpanel-wrapper">
        <Tabs
          fileData={fileData}
          onAddFile={onAddFile}
          onOverwriteFile={onOverwriteFile}
        />
        <Files
          fileData={fileData}
          currentFile={currentFile}
          onSwitchFile={onSwitchFile}
          onModifyFile={onModifyFile}
          onRemoveFile={onRemoveFile}
        />
      </div>
    );
  }
}

