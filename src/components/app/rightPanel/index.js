import "./style.less";
import React, { PureComponent } from "react";

import Compile from "./compile";
import Deploy from "./deploy";

export default class RightPanel extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tab:0,
      contracts:null,
      contractOptions:[]
    };

    this.onSetContracts = this.onSetContracts.bind(this);
    this.onCompile = this.onCompile.bind(this);
    this.onClearDeploy = this.onClearDeploy.bind(this);
  }

  onSetContracts(contracts = null,contractOptions = []){
    this.setState({
      contracts,
      contractOptions
    });
  }

  onCompile(){
    this.refs.compile.onCompile();
  }

  onClearDeploy(){
    this.refs.deploy.onClear();
  }

  render() {
    const {version,fileData,currentFile,settings,onShowMsg,onCopy,onWalletInstall,updateSettings,onConsole,onAutoSaveFile,onClearBeforeUnload} = this.props;
    const {tab} = this.state;

    return (
      <div className="rightpanel-wrapper">
        <div className="tabs-wrapper">
          <ul>
            <li className={tab === 0 ? "active": ""}>
              <a onClick={()=>{
                this.setState({
                  tab:0
                });
              }}>编译</a>
            </li>
            <li className={tab === 1 ? "active": ""}>
              <a onClick={()=>{
                this.setState({
                  tab:1
                });
              }}>部署</a>
            </li>
          </ul>
        </div>
        <div className={tab !== 0 ? "hidden" : ""}>
          <Compile
            ref="compile"
            version={version}
            fileData={fileData}
            currentFile={currentFile}
            settings={settings}
            onSetContracts={this.onSetContracts}
            onCopy={onCopy}
            updateSettings={updateSettings}
            onAutoSaveFile={onAutoSaveFile}
            onClearBeforeUnload={onClearBeforeUnload}
          />
        </div>
        <div className={tab !== 1 ? "hidden" : ""}>
          <Deploy
            ref="deploy"
            currentFile={currentFile}
            contracts={this.state.contracts}
            contractOptions={this.state.contractOptions}
            onShowMsg={onShowMsg}
            onCopy={onCopy}
            onWalletInstall={onWalletInstall}
            onConsole={onConsole}
          />
        </div>
      </div>
    );
  }
}
