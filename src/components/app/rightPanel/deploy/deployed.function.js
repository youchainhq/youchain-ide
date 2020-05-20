import "./deployed.less";
import _ from "lodash";
import React, { PureComponent } from "react";

import { Button, Input } from "../../../../components/vendors";

export default class Function extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      inputsEx:false,
      inputArguments:[],
      outputs:{}
    };

    this.formatInputs = this.formatInputs.bind(this);
    this.onInputArguments = this.onInputArguments.bind(this);
    this.onValidateArguments = this.onValidateArguments.bind(this);
    this.onRun = this.onRun.bind(this);
    this.onMethodData = this.onMethodData.bind(this);
  }

  formatInputs(){
    const {func} = this.props;
    let ret = [];

    _.forEach(func.inputs,(item)=>{
      ret.push(`${item.type} ${item.name}`);
    });

    return ret.join(",");
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

  onValidateArguments(){
    const {func} = this.props;
    const {inputArguments} = this.state;

    const inputs = func.inputs;

    if(!_.isEmpty(inputs) && _.isEmpty(inputArguments)){
      return {
        ret:false
      }
    }

    return {
      ret:true
    }
  }

  onRun(){
    const {contract,func,address} = this.props;

    this.props.onRun(contract,address,func,this.state.inputArguments,(output)=>{
      let outputs = {...this.state.outputs};
      outputs[func.name] = output;
      this.setState({
        outputs
      });
    });
  }

  onMethodData(){
    const {contract,func} = this.props;

    this.props.onMethodData(contract,func,this.state.inputArguments);
  }

  render() {
    const {func} = this.props;
    const {inputsEx,outputs} = this.state;
    const buttonType = func.payable ? "danger" : (func.constant ? "warning" : "primary");

    return (
      <div className="deployed-function-wrapper">
        {
          inputsEx ?
            <section className="form-wrapper inputs-region">
              <div>
                <span>{func.name}</span>
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
                  func.inputs.map((input,key)=>{
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
                <a onClick={this.onMethodData}>
                  <i className="fa icon-file"/>
                </a>
                <Button
                  text={func.constant ? "call" : "transact"}
                  type={buttonType}
                  block={false}
                  onClick={this.onRun}
                />
              </div>
            </section> :
            <section className="form-wrapper">
              <Button
                text={func.name}
                type={buttonType}
                block={false}
                onClick={this.onRun}
              />
              {
                !_.isEmpty(func.inputs) || func.type === "fallback" ?
                  <Input
                    ref="arguments"
                    placeholder={this.formatInputs()}
                    value={this.state.inputArguments.join(",")}
                    onChange={this.onInputArguments}
                    onValidate={this.onValidateArguments}
                  /> : null
              }
              {
                !_.isEmpty(func.inputs) ?
                  <a onClick={()=>{
                    this.setState({
                      inputsEx:!inputsEx
                    })
                  }}>
                    <i className="fa icon-angle-down"/>
                  </a> : null
              }
            </section>
        }
        {
          outputs && outputs[func.name] ?
            <section className="output-region">
              {_.keys(outputs[func.name]).map((item,key)=>{
                return (
                  <p key={key}>{item}:{String(outputs[func.name][item])}</p>
                )
              })}
            </section> : null
        }
      </div>

    );
  }
}