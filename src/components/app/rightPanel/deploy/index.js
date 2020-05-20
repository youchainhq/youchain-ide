import "./style.less";
import _ from "lodash";
import React, { PureComponent } from "react";
import {Contract} from "youchain-you-contract";
import {isAddress,toLu,fromLu,isHex,asciiToHex} from "youchain-utils";
import {formatAddress,formatAccuracy} from "../../../../common/utils";

import {Button,Select,Input} from "../../../../components/vendors";
import ProviderModal from "./provider";
import Deployed from "./deployed";

export default class Deploy extends PureComponent {
  constructor(props) {
    super(props);

    this._environments = [
      {
        value:0,
        label:"请选择"
      },
      {
        value:"injected",
        label:"Injected YOUChain"
      },
      // {
      //   value:"provider",
      //   label:"YOUChain Provider"
      // }
    ];

    this._accounts = [
      {
        value:"0",
        label:"请选择账号"
      }
    ];

    this._units = [
      {
        value:"you",
        label:"you"
      },
      {
        value:"lu",
        label:"lu"
      },
      {
        value:"glu",
        label:"glu"
      }
    ];

    this._contracts = [];

    this.state = {
      environment:this._environments[0],
      account:this._accounts[0],
      network:null,
      gasLimit:3000000,
      value:0,
      unit:this._units[0],
      contracts:null,
      constructor:null,
      inputsEx:false,
      inputArguments:[],
      currentContract:null,
      provider:false,
      atAddress:"",
      deployed:[]
    };

    this.onChangeEnvironment = this.onChangeEnvironment.bind(this);
    this.onChangeAccount = this.onChangeAccount.bind(this);
    this.onInputGasLimit = this.onInputGasLimit.bind(this);
    this.onValidateGasLimit = this.onValidateGasLimit.bind(this);
    this.onInputValue = this.onInputValue.bind(this);
    this.onChangeUnit = this.onChangeUnit.bind(this);
    this.onChangeContract = this.onChangeContract.bind(this);
    this.onValidateArguments = this.onValidateArguments.bind(this);
    this.onDeploy = this.onDeploy.bind(this);
    this.onInputAtAddress = this.onInputAtAddress.bind(this);
    this.formatInputs = this.formatInputs.bind(this);
    this.onInputArguments = this.onInputArguments.bind(this);
    this.onEncodeABI = this.onEncodeABI.bind(this);
    this.onAtAddress = this.onAtAddress.bind(this);
    this.onClearDeployed = this.onClearDeployed.bind(this);
    this.onRemoveDeployed = this.onRemoveDeployed.bind(this);
    this.onMethodData = this.onMethodData.bind(this);
    this.onMethod = this.onMethod.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    if(!_.isEqual(nextProps.contracts,this.props.contracts)){
      this._contracts = [...nextProps.contractOptions];
      const contract = _.isEmpty(this._contracts) ? null : this._contracts[0];
      let constructor = null;
      if(contract){
        constructor = this.getConstructor(contract,nextProps.contracts);
      }
      this.setState({
        currentContract:contract,
        contracts:nextProps.contracts,
        constructor:constructor,
        inputsEx:false,
        inputArguments:[]
      });
    }
  }

  _getAccountCallback(data){
    if(process.env.NODE_ENV !== "development" && data.network){
      const network = data.network;
      const protocol = network.provider && /^(https:\/\/?(.*))$/.test(network.provider) ? "https:" : "http:";

      if(protocol !== window.location.protocol){
        window.location.href = `${protocol}//${window.location.host}`;
        return false;
      }
    }
    this._accounts = [];

    _.forEach(data.accounts,(item)=>{
      if(item.address === data.activeAccount){
        this._accounts.push({
          value:item.address,
          label:`${formatAddress(item.address)}(${item.balance ? parseFloat(formatAccuracy(item.balance)).toFixed(2) : 0}YOU)`
        });
      }
    });

    this.setState({
      account:_.find(this._accounts,["value",data.activeAccount]),
      network:data.network
    });
  }

  onChangeEnvironment(environment){
    this.setState({
      environment,
      network:null
    });

    if(environment.value === "injected"){
      if(window.youchain){
        window.youchain.send(
          "you_requestAccounts",
          {
            callback:(data)=>{
              this._getAccountCallback(data);
            }
          }
        );
      }
      else{
        this.props.onWalletInstall();
      }
    }
    else if(environment.value === "provider"){
      this.setState({
        provider:true
      });
    }
  }

  onChangeAccount(account){
    this.setState({
      account
    });
  }

  onInputGasLimit(e){
    let value = e.target.value.trim();

    if(!value){
      this.setState({
        gasLimit:""
      });

      return false;
    }

    if(!/^\d+$/.test(value)){
      return false;
    }

    if(value <=0){
      return false;
    }

    this.setState({
      gasLimit:value
    });
  }

  onValidateGasLimit(){
    const {gasLimit} = this.state;

    if(!gasLimit){
      return {
        ret:false
      }
    }

    return {
      ret:true
    }
  }

  onValidateArguments(){
    const {constructor,inputArguments} = this.state;

    if(!constructor){
      return {
        ret:true
      }
    }

    if(!constructor && !_.isEmpty(constructor.inputs) && _.isEmpty(inputArguments)){
      return {
        ret:false
      }
    }

    return {
      ret:true
    }
  }

  onInputValue(e){
    this.setState({
      value:e.target.value
    });
  }

  onChangeUnit(unit){
    this.setState({
      unit
    });
  }

  formatValue(){
    const {value,unit} = this.state;

    if(value && Math.abs(value) > 0){
      const lu = toLu(value,unit.value);
      return fromLu(lu.toString(),"you");
    }
    return value;
  }

  getConstructor(contract,contracts){
    contracts = contracts || this.state.contracts;

    if(contracts){
      const _contract = contracts[contract.value];

      if(_contract){
        const constructor = _.find(_contract.abi,["type","constructor"]);

        return constructor || null;
      }
    }

    return null;
  }

  formatInputs(){
    const {constructor} = this.state;
    const inputs = constructor.inputs;

    let ret = [];

    _.forEach(inputs,(item)=>{
      ret.push(`${item.type} ${item.name}`);
    });

    return ret.join(",");
  }

  onChangeContract(contract){
    const constructor = this.getConstructor(contract);

    this.setState({
      currentContract:contract,
      constructor:constructor
    });
  }

  onInputArguments(e,key = -1){
    const value = e.target.value;

    if(key === -1){
      this.setState({
        inputArguments:value.split(",")
      });
    }
    else{
      let inputArguments = [...this.state.inputArguments];
      if(inputArguments.length > key){
        inputArguments[key] = value;
      }
      else{
        for(let i = inputArguments.length;i < key;i++){
          inputArguments.push("");
        }
        inputArguments[key] = value;
      }

      this.setState({
        inputArguments:inputArguments
      });
    }
  }

  onEncodeABI(){
    const {contracts,inputArguments,currentContract} = this.state;

    const current = contracts[currentContract.value];

    const contract = new Contract(null, null, current.abi);

    const encodeABI = contract.deploy({
      data:current.evm.bytecode.object,
      arguments:inputArguments || []
    }).encodeABI();

    this.props.onCopy(`0x${encodeABI}`);
  }

  deployCall(contractKey,isLibrary = false){
    const {currentContract,contracts,inputArguments,account,gasLimit} = this.state;
    const {onConsole} = this.props;

    try{
      const target = contracts[contractKey];
      const contract = new Contract(null, null, target.abi);

      const encodeABI = contract.deploy({
        data:isLibrary ? target.evm.bytecode.object : this._bytecode,
        arguments:isLibrary ? [] : (inputArguments || [])
      }).encodeABI();

      if(onConsole){
        onConsole(`creation of ${isLibrary ? "library":""} ${contractKey} pending...`);
      }

      window.youchain.send(
        "you_sendTransaction",
        {
          from:account.value,
          gasLimit:gasLimit,
          data:`0x${encodeABI}`,
          callback:(data)=>{
            if(onConsole){
              _.forEach(_.keys(data),(key)=>{
                if(key === "receipt"){
                  const tx = JSON.parse(data[key]);
                  const contractAddress = tx.contractAddress;
                  const transactionHash = tx.transactionHash;

                  const {network} = this.state;
                  if(network.explorer && transactionHash){
                    onConsole(`${network.explorer}/transaction/detail/${transactionHash}`);
                  }
                  else{
                    onConsole(`${key}:`);
                  }

                  onConsole(data[key]);

                  if(contractAddress){
                    if(isLibrary){
                      this._bytecode = this._bytecode.split(this._bytecode.substr(this._bytecode.indexOf("_"),40)).join(contractAddress.substr(2));

                      _.delay(()=>{
                        this.deployRun(this._bytecode);
                      },500);
                    }
                    else{
                      let deployed = [...this.state.deployed];
                      deployed.push({
                        address:contractAddress,
                        contract:currentContract,
                        functions:this.getFunctions(currentContract)
                      });

                      _.delay(()=>{
                        this.setState({
                          deployed
                        })
                      },500);
                    }
                  }
                }
                else{
                  onConsole(`${key}:`);
                  onConsole(data[key]);
                }
              });
            }
          }
        }
      );
    }
    catch (e) {
      if(onConsole){
        onConsole(e.message);
      }
    }
  }

  deployRun(){
    const {currentContract} = this.state;

    if(this._bytecode.indexOf("_") > -1){
      const match = this._bytecode.substr(this._bytecode.indexOf("_"),40);
      const exec = /:(.*_?[a-zA-Z0-9]+)_?/gi.exec(match);

      if(exec){
        const library = exec[1];

        if(library){
          this.deployCall(library,true);

          return false;
        }
      }
    }

    this.deployCall(currentContract.value);
  }

  onDeploy(){
    const {environment,contracts,currentContract,network,account,gasLimit} = this.state;
    const {onShowMsg,onConsole} = this.props;

    if(!(window.youchain && window.youchain.isYOUWallet)){
      this.props.onWalletInstall();
      return false;
    }

    if(!currentContract){
      onShowMsg && onShowMsg("请先编译合约","warning");
      return false;
    }

    if(!environment.value){
      onShowMsg && onShowMsg("请选择环境","warning");
      return false;
    }

    if(!account.value){
      onShowMsg && onShowMsg("请选择账号","warning");
      return false;
    }

    const vgl = this.onValidateGasLimit();

    if(!vgl.ret){
      this.refs.gasLimit.onBlur();
      onShowMsg && onShowMsg("请输入GasLimit","warning");
      return false;
    }

    const va = this.onValidateArguments();

    if(!va.ret){
      this.refs.arguments.onBlur();
      onShowMsg && onShowMsg("请输入参数","warning");
      return false;
    }

    if(contracts && currentContract && network && gasLimit){
      let current = contracts[currentContract.value];
      this._bytecode = current.evm.bytecode.object;

      if(this._bytecode.length){
        this.deployRun();
      }
      else{
        onConsole('This contract may be abstract, may not implement an abstract parent\'s methods completely or not invoke an inherited contract\'s constructor correctly.');
      }
    }
  }

  getFunctions(contract,contracts){
    contracts = contracts || this.state.contracts;

    if(contracts){
      const _contract = contracts[contract.value];

      if(_contract){
        const functions = _.filter(_contract.abi,(item)=>{
          return _.indexOf(["function","fallback"],item.type.toLocaleLowerCase()) > -1;
        });

        return functions || [];
      }
    }

    return [];
  }

  onInputAtAddress(e){
    this.setState({
      atAddress:e.target.value.trim()
    });
  }

  onAtAddress(){
    const {atAddress,currentContract} = this.state;

    if(!currentContract){
      this.props.onShowMsg("请先编译合约","warning");
      return false;
    }

    if(isAddress(atAddress)){
      let deployed = [...this.state.deployed];
      deployed.push({
        address:atAddress,
        contract:currentContract,
        functions:this.getFunctions(currentContract)
      });

      this.setState({
        deployed
      });
    }
  }

  onClearDeployed(){
    this.setState({
      deployed:[]
    });
  }

  onRemoveDeployed(idx){
    let deployed = [...this.state.deployed];
    _.pullAt(deployed,[idx]);

    this.setState({
      deployed
    });
  }

  parseFunctionParams (params) {
    let args = []
    // Check if parameter string starts with array or string
    let startIndex = this.isArrayOrStringStart(params, 0) ? -1 : 0
    for (let i = 0; i < params.length; i++) {
      // If a quote is received
      if (params.charAt(i) === '"') {
        startIndex = -1
        let endQuoteIndex = false
        // look for closing quote. On success, push the complete string in arguments list
        for (let j = i + 1; !endQuoteIndex; j++) {
          if (params.charAt(j) === '"') {
            args.push(params.substring(i + 1, j))
            endQuoteIndex = true
            i = j
          }
        }
      }
      else if (params.charAt(i) === '[') {  // If a array opening bracket is received
        startIndex = -1
        let bracketCount = 1
        let j
        for (j = i + 1; bracketCount !== 0; j++) {
          // Increase count if another array opening bracket is received (To handle nested array)
          if (params.charAt(j) === '[') {
            bracketCount++
          } else if (params.charAt(j) === ']') {  // // Decrease count if an array closing bracket is received (To handle nested array)
            bracketCount--
          }
        }
        // If bracketCount = 0, it means complete array/nested array parsed, push it to the arguments list
        args.push(JSON.parse(params.substring(i, j)))
        i = j - 1
      }
      else if (params.charAt(i) === ',') {
        // if startIndex >= 0, it means a parameter was being parsed, it can be first or other parameter
        if (startIndex >= 0) {
          args.push(params.substring(startIndex, i))
        }
        // Register start index of a parameter to parse
        startIndex = this.isArrayOrStringStart(params, i + 1) ? -1 : i + 1
      }
      else if (startIndex >= 0 && i === params.length - 1) {
        // If start index is registered and string is completed (To handle last parameter)
        args.push(params.substring(startIndex, params.length))
      }
    }
    args = args.map(e => {
      if (!Array.isArray(e)) {
        return e.trim()
      } else {
        return e
      }
    })
    return args
  }

  isArrayOrStringStart (str, index) {
    return str.charAt(index) === '"' || str.charAt(index) === '['
  }

  formatArgs(args){
    const {onConsole} = this.props;

    let params = [];

    args.forEach(item =>{
      try{
        if(item.length > 0){
          params.push(this.parseFunctionParams(item)[0]);
        }
      }
      catch(e){
        onConsole('Error encoding arguments: ' + e.message);
      }
    });

    if(_.isEmpty(params)){
      params = args;
    }

    return params;
  }

  getMethodData(targetContract,method,args){
    if(method.type === "fallback"){
      let data = args.join("");

      if(data.slice(0,2) !== '0x'){
        data = `0x${data}`;
      }

      return data;
    }

    const {contracts} = this.state;

    const current = contracts[targetContract.value];

    const contract = new Contract(null, null, current.abi);

    const params = this.formatArgs(args);

    return contract.methods[method.name](...params).encodeABI();
  }

  onMethodData(targetContract,method,args){
    const data = this.getMethodData(targetContract,method,args);
    this.props.onCopy(data);
  }

  onMethodConstant(targetContract,method,args,address,methodData,callback){
    const {onConsole} = this.props;
    const {contracts,network,account} = this.state;

    const current = contracts[targetContract.value];

    const contract = new Contract(network.provider, null, current.abi,address);

    const params = this.formatArgs(args);

    contract.methods[method.name](...params).call({
      from:account.value
    }).then((data)=>{
      let inputs = [];
      let decodedInput = {};
      let decodedOutput = {};

      _.forEach(method.inputs,(item,key)=>{
        inputs.push(item.type);
        decodedInput[`${item.type} ${item.name}`.trim()] = params[key];
      });

      _.forEach(method.outputs,(item,key)=>{
        decodedOutput[`${item.type} ${item.name}`.trim()] = _.isPlainObject(data) ? data[key] : data;
      });

      if(callback && !_.isEmpty(decodedOutput)){
        callback(decodedOutput);
      }

      const hash = `call${account.value}${address}${methodData}`;
      const output = {
        "transaction hash":hash,
        "from":account.value,
        "to":`${targetContract.value}.${method.name}(${inputs.join(",")}) ${address}`,
        "hash":hash,
        "input":methodData,
        "output":data,
        "decoded input":decodedInput,
        "decoded output":decodedOutput
      };
      onConsole(JSON.stringify(output));
    }).catch((e) =>{
      onConsole(e.message);
    });
  }

  onMethod(targetContract,to,method,args,callback){
    const {environment,account,gasLimit} = this.state;
    const {onShowMsg,onConsole} = this.props;

    if(!(window.youchain && window.youchain.isYOUWallet)){
      this.props.onWalletInstall();
      return false;
    }

    if(!environment.value){
      onShowMsg && onShowMsg("请选择环境","warning");
      return false;
    }

    if(!account.value){
      onShowMsg && onShowMsg("请选择账号","warning");
      return false;
    }

    const vgl = this.onValidateGasLimit();

    if(!vgl.ret){
      this.refs.gasLimit.onBlur();
      onShowMsg && onShowMsg("请输入GasLimit","warning");
      return false;
    }

    try{
      const methodData = this.getMethodData(targetContract,method,args);

      if(!isHex(methodData)){
        onConsole("Error: The data field must be HEX encoded data.");
        return false;
      }

      if(method.constant){
        if(onConsole){
          onConsole(`call to ${targetContract.value}.${method.name}`);
        }

        this.onMethodConstant(targetContract,method,args,to,methodData,callback);
      }
      else{
        if(onConsole){
          onConsole(`transact to ${targetContract.value}.${method.name} pending...`);
        }

        window.youchain.send(
          "you_sendTransaction",
          {
            from:account.value,
            gasLimit:gasLimit,
            to:to,
            method:method.name,
            data:methodData,
            value:this.formatValue(),
            callback:(data)=>{
              if(onConsole){
                _.forEach(_.keys(data),(key)=>{
                  if(key === "receipt"){
                    const tx = JSON.parse(data[key]);
                    const transactionHash = tx.transactionHash;

                    const {network} = this.state;
                    if(network.explorer && transactionHash){
                      onConsole(`${network.explorer}/transaction/detail/${transactionHash}`);
                    }
                    else{
                      onConsole(`${key}:`);
                    }

                    onConsole(data[key]);

                    this.setState({
                      value:0
                    });
                  }
                  else{
                    onConsole(`${key}:`);
                    onConsole(data[key]);
                  }
                });
              }
            }
          }
        );
      }
    }
    catch(e){
      if(onConsole){
        onConsole(e.message);
      }
    }
  }

  onClear(){
    this.setState({
      constructor:null,
      inputsEx:false,
      inputArguments:[],
      atAddress:"",
      deployed:[]
    });
  }

  render() {
    const {currentContract,network,constructor,inputsEx,deployed} = this.state;
    const {onCopy} = this.props;

    return (
      <div className="rightpanel-deploy-wrapper">
        <section>
          <section className="form-wrapper">
            <div className="form-title">环境：</div>
            <Select
              options={this._environments}
              defaultOption={this.state.environment}
              onChange={this.onChangeEnvironment}
              hint={network ? `${network.name}` : null}
            />
          </section>
          <section className="form-wrapper">
            <div className="form-title">账号：</div>
            <Select
              options={this._accounts}
              defaultOption={this.state.account}
              onChange={this.onChangeAccount}
            />
          </section>
          <section className="form-wrapper gasLimit-region">
            <div className="form-title">Gas Limit：</div>
            <Input
              ref="gasLimit"
              value={this.state.gasLimit}
              onChange={this.onInputGasLimit}
              onValidate={this.onValidateGasLimit}
            />
          </section>
          <section className="form-wrapper value-region">
            <div className="form-title">Value：</div>
            <Input
              value={this.state.value}
              onChange={this.onInputValue}
            />
            <Select
              options={this._units}
              defaultOption={this.state.unit}
              onChange={this.onChangeUnit}
            />
          </section>
          {
            currentContract ?
              <section className="form-wrapper contract-region">
                <Select
                  options={this._contracts}
                  defaultOption={currentContract}
                  onChange={this.onChangeContract}
                />
              </section> : null
          }
          {
            inputsEx ?
              <section className="form-wrapper inputs-region">
                <div>
                  <span>部署</span>
                  <a onClick={()=>{
                    this.setState({
                      inputsEx:!inputsEx
                    });
                  }}>
                    <i className="fa icon-angle-down up"/>
                  </a>
                </div>
                <div>
                  {
                    constructor && constructor.inputs.map((input,key)=>{
                      return (
                        <section key={key}>
                          <p>{input.name}:</p>
                          <Input
                            placeholder={input.type}
                            value={this.state.inputArguments[key] || ""}
                            onChange={(e)=>{
                              this.onInputArguments(e,key);
                            }}
                          />
                        </section>
                      )
                    })
                  }
                </div>
                <div>
                  <a onClick={this.onEncodeABI}>
                    <i className="fa icon-file"/>
                  </a>
                  <Button
                    text={"确认部署"}
                    type={constructor && constructor.payable ? "danger" : "primary"}
                    block={false}
                    onClick={this.onDeploy}
                  />
                </div>
              </section> :
              <section className="form-wrapper actions-region">
                <Button
                  text={"确认部署"}
                  type={constructor && constructor.payable ? "danger" : "primary"}
                  block={false}
                  onClick={this.onDeploy}
                />
                {
                  !constructor || _.isEmpty(constructor.inputs) ? null :
                    <Input
                      ref="arguments"
                      placeholder={this.formatInputs()}
                      value={this.state.inputArguments.join(",")}
                      onChange={this.onInputArguments}
                      onValidate={this.onValidateArguments}
                    />
                }
                {
                  !constructor || _.isEmpty(constructor.inputs) ? null :
                    <a onClick={()=>{
                      this.setState({
                        inputsEx:!inputsEx
                      })
                    }}>
                      <i className="fa icon-angle-down"/>
                    </a>
                }
              </section>
          }
          <section className="or-region">
            or
          </section>
          <section className="form-wrapper actions-region">
            <Button
              text={"At Address"}
              type={"warning"}
              block={false}
              onClick={this.onAtAddress}
            />
            <Input
              value={this.state.atAddress}
              onChange={this.onInputAtAddress}
            />
          </section>
        </section>

        <Deployed
          data={deployed}
          onCopy={onCopy}
          onMethodData={this.onMethodData}
          onClear={this.onClearDeployed}
          onRemove={this.onRemoveDeployed}
          onRun={this.onMethod}
        />

        {
          this.state.provider ?
            <ProviderModal
              onDismiss={()=>{
                this.setState({
                  provider:false
                })
              }}
              onSubmit={()=>{
              }}
            /> : null
        }
      </div>
    );
  }
}
