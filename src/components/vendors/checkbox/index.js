import "./style.less";
import React,{PureComponent} from 'react';
import classnames from "classnames";

export default class Checkbox extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {children,checked,onChange,disabled} = this.props;

    const labelClass = classnames({
      disabled:!!disabled
    });

    return (
      <div className="checkbox">
        <label className={labelClass}>
          <input
            type="checkbox"
            checked={checked}
            disabled={!!disabled}
            onChange={()=>{
              onChange && onChange();
            }}
          />
          <i className="input-helper"/>
          {children}
        </label>
      </div>
    )
  }
}