import "./style.less";
import _ from "lodash";
import React, { PureComponent } from "react";
import classnames from "classnames";
import wrapper from "youchain-solc/wrapper";
import {Base64} from "js-base64";
const swarmgw = require('swarmgw')();
import configs from "../../../../common/configs";
import ContractParser from "../../../../common/contractParser";

import {Button,Select,Checkbox} from "../../../../components/vendors";

import DetailModal from "./detail";

export default class Compile extends PureComponent {
  constructor(props) {
    super(props);

    this._languages = [
      {
        value:"Solidity",
        label:"Solidity"
      }
    ];

    this._contracts = [];

    this.state = {
      versions:[],
      version:null,
      language:this._languages[0],
      contract:null,
      contracts:null,
      contractDetail:null,
      detail:false,
      running:false,
      errors:null,
      warnings:null
    };

    this.onChangeVersion = this.onChangeVersion.bind(this);
    this.onChangeLanguage = this.onChangeLanguage.bind(this);
    this.onCompile = this.onCompile.bind(this);
    this.onDetail = this.onDetail.bind(this);
    this.onChangeContract = this.onChangeContract.bind(this);
    this.onABI = this.onABI.bind(this);
    this.onBytecode = this.onBytecode.bind(this);

    this.fetchVersions();
  }

  loadScript(){
    const version = this.state.version;
    let body = document.getElementsByTagName('body')[0];

    let solcScript = document.getElementById("solc-script");
    if(solcScript){
      body.removeChild(solcScript);
    }

    let script = document.createElement("script");
    script.id = "solc-script";
    script.src = `https://ucstatic.iyouchain.com/solc-bin/bin/${encodeURIComponent(version.src)}`;
    body.appendChild(script);

    script.onload = ()=>{
      console.log('loaded');
    }
  }

  fetchVersions(){
    const activeVersion = this.props.version;

    fetch('https://youchainhq.github.io/solc-bin/bin/list.json').then(ret => {
      return ret.json();
    }).then((response)=>{
      let versions = [];
      _.forEach(_.keys(response.releases),(key)=>{
        versions.push({
          value:key,
          label:key,
          src:response.releases[key]
        })
      });

      const version = _.find(versions,['value',activeVersion || response.latestRelease]);

      this.setState({
        versions,
        version
      });

      _.delay(()=>{
        this.loadScript();
      },300);
    })
  }

  onChangeVersion(version){
    // this.setState({
    //   version
    // });

    this.props.onClearBeforeUnload();

    _.delay(()=>{
      window.location.href = `/?version=${version.value}`;
    },300);
  }

  onChangeLanguage(language){
    this.setState({
      language
    });
  }

  formatMessage(output){
    let warnings = output.warnings ? [...output.warnings] : [];
    let errors = [];

    if(output.errors){
      _.forEach(output.errors,(error)=>{
        if(error.severity === "warning"){
          warnings.push(error);
        }
        else{
          errors.push(error);
        }
      });
    }

    return {
      warnings:_.isEmpty(warnings) ? null : warnings,
      errors:_.isEmpty(errors) ? null : errors
    }
  };

  handleLocalhost(url,sources,request){
    let path = /(.*\/).*/.exec(name);
    if (path) {
      url = url.replace('./', path[1])
    } else {
      url = url.slice(2)
    }

    if(!sources[url]){
      const {fileData} = this.props;
      const target = _.find(fileData,["name",url]);
      if(target){
        sources[url] = {
          content:target.content
        };

        this.formatSources(target,sources,request);
      }
    }
  }

  handleGithub(url,request){
    const match = configs.regular.github.exec(url);
    let root = match[3];
    let path = match[4];

    let param = '?';

    const regex = path.match(/blob\/([^/]+)\/(.*)/);
    if(regex){
      const reference = regex[1];
      param += '&ref=' + reference;
      path = path.replace(`blob/${reference}/`, '');
    }

    const requestUrl = `https://api.github.com/repos/${root}/contents/${path}${param}`;

    request.push({
      type:"github",
      url:requestUrl,
      name:url
    });
  }

  handleHttp(url,request){
    const match = configs.regular.http.exec(url);

    request.push({
      type:"http",
      url:match[1],
      name:match[1]
    });
  }

  handleHttps(url,request){
    const match = configs.regular.https.exec(url);

    request.push({
      type:"https",
      url:match[1],
      name:match[1]
    });
  }

  handleSwarm(url,request){
    const match = configs.regular.swarm.exec(url);

    request.push({
      type:"swarm",
      url:match[1],
      name:match[1]
    });
  }

  handleIpfs(url,request){
    const match = configs.regular.ipfs.exec(url);
    url = match[1].replace(/^ipfs:\/\/?/, 'ipfs/');

    request.push({
      type:"ipfs",
      url:`https://ipfsgw.komputing.org/${url}`,
      name:match[1]
    });
  }

  requestGitHub(url){
    return new Promise((resolve)=>{
      fetch(url).then(response => {
        return response.json();
      }).then(json =>{
        if("content" in json){
          resolve(Base64.decode(json.content));
        }
      });
    });
  }

  requestHttp(url){
    return new Promise((resolve)=>{
      fetch(url).then(response =>{
        return response.text();
      }).then(content =>{
        resolve(content);
      });
    });
  }

  requestSwarm(url){
    return new Promise((resolve)=>{
      swarmgw.get(url,(err,content)=>{
        if(!err && content){
          resolve(content);
        }
      });
    });
  }

  handleImport(url,sources,request){
    if(url.startsWith('./')){
      this.handleLocalhost(url,sources,request);
    }
    else if(configs.regular.github.exec(url)){
      this.handleGithub(url,request);
    }
    else if(configs.regular.http.exec(url)){
      this.handleHttp(url,request);
    }
    else if(configs.regular.https.exec(url)){
      this.handleHttps(url,request);
    }
    else if(configs.regular.swarm.exec(url)){
      this.handleSwarm(url,request);
    }
    else if(configs.regular.ipfs.exec(url)){
      this.handleIpfs(url,request);
    }
  }

  formatSources(file,sources,request){
    const importRegex = /\s*import\s*[\'\"]([^\'\"]+)[\'\"];/g;
    const notesRegex = /\/\/\s*import\s*[\'\"]([^\'\"]+)[\'\"];/g;
    let imports = file.content.match(importRegex);
    const notes = file.content.match(notesRegex);

    if(imports){
      let ret = [...imports];

      _.forEach(imports,(item)=>{
        _.forEach(notes,(note)=>{
          if(note.indexOf(item) > -1){
            _.remove(ret,(i)=>{
              return i === item;
            });
          }
        })
      });

      imports = ret;
    }

    if(imports && !_.isEmpty(imports)){
      _.forEach(imports,(item)=>{
        let exec;
        while (exec = importRegex.exec(item.trim())) {
          let importFilePath = exec[1];
          this.handleImport(importFilePath,sources,request);
        }
      })
    }
  }

  async requestSources(sources){
    const {currentFile} = this.props;

    sources[currentFile.name] = {
      content:currentFile.content
    };

    let request = [];

    this.formatSources(currentFile,sources,request);

    const promises = await request.map(async item =>{
      switch (item.type) {
        case "github":
          const githubContent = await this.requestGitHub(item.url);
          sources[item.name] = {
            content:githubContent
          };
          break;
        case "swarm":
          const swarmContent = await this.requestSwarm(item.url);
          sources[item.name] = {
            content:swarmContent
          };
          break;
        default:
          const httpContent = await this.requestHttp(item.url);
          sources[item.name] = {
            content:httpContent
          };
          break;
      }
    });

    await Promise.all(promises);
  }

  onCompile(){
    this.setState({
      running:true,
      warnings:null,
      errors:null
    });

    const {settings:{enableOptimization}} = this.props;

    let sources = {};

    this.requestSources(sources).then(()=>{
      _.delay(()=>{
        const solc = wrapper(window.Module);

        const input = {
          language: this.state.language.value,
          sources: sources,
          settings: {
            optimizer: {
              enabled: enableOptimization,
              runs: 200
            },
            outputSelection: {
              '*': {
                '': [ 'legacyAST' ],
                '*': [ 'abi', 'metadata', 'devdoc', 'userdoc', 'evm.legacyAssembly', 'evm.bytecode', 'evm.deployedBytecode', 'evm.methodIdentifiers', 'evm.gasEstimates' ]
              }
            }
          }
        };

        const output = JSON.parse(solc.compile(JSON.stringify(input)));

        if(_.isEmpty(output.contracts)){
          this.compileFail(output);
        }
        else{
          this.compileSuccess(output);
        }
      },500);
    });
  }

  compileSuccess(output){
    const {currentFile,onSetContracts} = this.props;

    const sourceKeys = _.keys(output.contracts);

    let contracts = {};
    this._contracts = [];

    _.forEach(sourceKeys,(file)=>{
      const fileContracts = output.contracts[file];
      const keys = _.keys(fileContracts);

      _.forEach(keys,(item)=>{
        contracts[item] = fileContracts[item];
        this._contracts.push({
          value:item,
          label:`${item}(${file})`
        })
      });
    });

    const currentContract = this._contracts[0];

    const contractDetail = currentContract ? new ContractParser(currentContract.value,contracts[currentContract.value],currentFile) : null;

    const message = this.formatMessage(output);

    this.setState({
      running:false,
      contracts:contracts,
      contract:currentContract,
      contractDetail:contractDetail,
      warnings:message.warnings,
      errors:message.errors
    });

    onSetContracts && onSetContracts(contracts,this._contracts);
  }

  compileFail(output){
    const {onSetContracts} = this.props;

    const message = this.formatMessage(output);

    this._contracts = [];
    this.setState({
      running:false,
      contracts:null,
      contract:null,
      contractDetail:null,
      warnings:message.warnings,
      errors:message.errors
    });

    onSetContracts && onSetContracts();
  }

  onDetail(){
    this.setState({
      detail:true
    });
  }

  onChangeContract(contract){
    const {currentFile} = this.props;
    const contractDetail = new ContractParser(contract.value,this.state.contracts[contract.value],currentFile);

    this.setState({
      contract,
      contractDetail
    });
  }

  onBytecode(){
    this.props.onCopy(JSON.stringify(this.state.contractDetail.bytecode));
  }

  onABI(){
    this.props.onCopy(JSON.stringify(this.state.contractDetail.abi));
  }

  render() {
    const {settings:{autoCompile, enableOptimization, hideWarnings},updateSettings,onAutoSaveFile,onCopy} = this.props;

    const loadingClass = classnames({
      "fa":true,
      "icon-loading":true,
      "rotate":this.state.running
    });

    return (
      <div className="rightpanel-compile-wrapper">
        <section className="compile-region">
          <section className="form-wrapper">
            <div className="form-title">编译器：</div>
            {
              this.state.version ? <Select
                options={this.state.versions}
                defaultOption={this.state.version}
                onChange={this.onChangeVersion}
              /> : null
            }

          </section>
          <section className="form-wrapper">
            <div className="form-title">语言：</div>
            <Select
              options={this._languages}
              defaultOption={this.state.language}
              onChange={this.onChangeLanguage}
            />
          </section>
          <section>
            <Button
              type={"primary"}
              block={true}
              disabled={this.state.running}
              onClick={()=>{
                onAutoSaveFile && onAutoSaveFile();
                this.onCompile();
              }}
            >
              <div>
                <i className={loadingClass}/>
                <span className="m-l-5">开始编译</span>
              </div>
            </Button>
            <div className="compile-options">
              <Checkbox checked={autoCompile} onChange={()=>{
                updateSettings && updateSettings({
                  autoCompile:!autoCompile
                });
              }}>
                自动编译
              </Checkbox>
              <Checkbox checked={enableOptimization} onChange={()=>{
                updateSettings && updateSettings({
                  enableOptimization:!enableOptimization
                })
              }}>
                启动优化
              </Checkbox>
              <Checkbox checked={hideWarnings} onChange={()=>{
                updateSettings && updateSettings({
                  hideWarnings:!hideWarnings
                })
              }}>
                隐藏警告
              </Checkbox>
            </div>
          </section>
        </section>
        {
          this.state.contracts ?
          <section className="contract-region">
            <div>
              <section className="form-wrapper">
                <div className="form-title">合约：</div>
                <Select
                  options={this._contracts}
                  defaultOption={this.state.contract}
                  onChange={this.onChangeContract}
                />
              </section>
            </div>
            <div className="detail-actions">
              <Button
                text={"编译详情"}
                type={"primary"}
                onClick={this.onDetail}
              />
              <a onClick={this.onABI}>
                <i className="fa icon-file"/>
                ABI
              </a>
              <a onClick={this.onBytecode}>
                <i className="fa icon-file"/>
                Bytecode
              </a>
            </div>
          </section> : null
        }

        {
          !hideWarnings && this.state.warnings ?
            <section className="warning-region">
              {
                this.state.warnings.map((item,key)=>{
                  return (
                    <div key={key}>{item.formattedMessage}</div>
                  )
                })
              }
            </section> : null
        }

        {
          this.state.errors ?
            <section className="error-region">
              {
                this.state.errors.map((item,key)=>{
                  return (
                    <div key={key}>{item.formattedMessage}</div>
                  )
                })
              }
            </section> : null
        }

        {
          this.state.detail ?
            <DetailModal
              contract={this.state.contractDetail}
              onCopy={onCopy}
              onDismiss={()=>{
                this.setState({
                  detail:false
                })
              }}
            /> : null
        }
      </div>
    );
  }
}