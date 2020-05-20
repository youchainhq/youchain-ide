import "./deployed.less";
import _ from "lodash";
import React, { PureComponent } from "react";
import {formatAddress} from "../../../../common/utils";

import Func from "./deployed.function";

export default class Item extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open:false
    };

    this.onSwitch = this.onSwitch.bind(this);
  }

  onSwitch(){
    this.setState({
      open: !this.state.open
    })
  }

  formatFunctions(){
    const {data} = this.props;
    let functions = [...data.functions];

    _.forEach(functions,(item)=>{
      if(item.type === "fallback"){
        item.name = "(fallback)";
      }
      item._name = item.name.toLocaleLowerCase();
    });

    return _.orderBy(functions,["payable","constant","_name"],["desc","asc","asc"]);
  }

  render() {
    const {idx,data:{contract,address},onCopy,onRemove,onMethodData,onRun} = this.props;

    return (
      <section className="deployed-item-wrapper">
        <div>
          <a onClick={this.onSwitch}>
            <i className={`fa icon-angle-${this.state.open ? "down" : "right"}`}/>
          </a>
          <span>
            {contract.value} at {formatAddress(address)}(memory)
          </span>
          <a onClick={()=>{
            onCopy(address);
          }}>
            <i className="fa icon-copy"/>
          </a>
          <a onClick={()=>{
            onRemove(idx);
          }}>
            <i className="fa icon-close"/>
          </a>
        </div>
        <div className={this.state.open ? "" :"hidden"}>
          {
            this.formatFunctions().map((item,key)=>{
              return (
                <Func
                  key={key}
                  func={item}
                  address={address}
                  contract={contract}
                  onMethodData={onMethodData}
                  onRun={onRun}
                />
              )
            })
          }
        </div>
      </section>
    );
  }
}