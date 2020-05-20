import "./style.less";
import _ from "lodash";
import React, { PureComponent } from "react";

export default class Tabs extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
   const {fileData,currentFile,opened,onSwitchFile,onCloseFile} = this.props;

    return (
      <div className="centerpanel-tabs-wrapper">
        <ul>
          {
            opened.map((name,key)=>{
              const file = _.find(fileData,["name",name]);

              return (
                <li key={key} className={file.name === currentFile.name ? "active" : ""}>
                  <a>
                    <label onClick={()=>{
                      onSwitchFile && onSwitchFile(file);
                    }}>{`browser/${file.name}`}</label>
                    <i
                      className="fa icon-close"
                      onClick={(e)=>{
                        e.preventDefault();
                        onCloseFile && onCloseFile(file);
                      }}
                    />
                  </a>
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  }
}