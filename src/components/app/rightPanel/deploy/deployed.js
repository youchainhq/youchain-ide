import "./deployed.less";
import _ from "lodash";
import React, { PureComponent } from "react";

import Item from "./deployed.item";

export default class Deployed extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {data,onCopy,onMethodData,onClear,onRemove,onRun} = this.props;

    return (
      <div className="deployed-wrapper">
        <section>
          <span>Deployed Contracts</span>
          <a onClick={onClear}>
            <i className="fa icon-clear"/>
          </a>
        </section>
        <section>
          {
            _.isEmpty(data) ?
              <div>Currently you have no contract instances to interact with.</div>:
              <div>
                {
                  data.map((item,key)=>{
                    return (
                      <Item
                        key={key}
                        idx={key}
                        data={item}
                        onCopy={onCopy}
                        onMethodData={onMethodData}
                        onRemove={onRemove}
                        onRun={onRun}
                      />
                    )
                  })
                }
              </div>
          }
        </section>
      </div>
    );
  }
}