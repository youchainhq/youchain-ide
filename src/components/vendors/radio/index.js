import "./style.less";
import React,{PureComponent} from 'react';

export default class Radio extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {children,name,checked,onChange} = this.props;

    return (
      <div className="radio">
        <label>
          <input type="radio" name={name} checked={checked} onChange={()=>{
            onChange && onChange();
          }}/>
          <i className="input-helper"/>
          {children}
        </label>
      </div>
    )
  }
}