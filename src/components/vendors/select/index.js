import "./style.less";
import _ from "lodash";
import React,{PureComponent} from 'react';

import Dropdown from "../dropdown";

export default class Select extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      option:null
    };

    this.onSetOption = this.onSetOption.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount(){
    const {defaultOption} = this.props;

    this.setState({
      option:defaultOption || this.props.options[0]
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(!_.isEqual(this.props.defaultOption, nextProps.defaultOption)){
      this.setState({
        option:nextProps.defaultOption || this.props.options[0]
      });
    }
  }

  onSetOption(value){
    this.setState({
      option:value
    });
  }

  onChange(value){
    this.setState({
      option:value
    });

    this.props.onChange(value);
  }

  render(){
    const {options,hint} = this.props;

    return (
      <div className="select-layout">
        <Dropdown ref="select">
          <a className="select-label">
            <div className="label">{this.state.option.label}</div>
            <div>
              <i className="fa icon-select"/>
            </div>
          </a>
          <ul>
            {
              options.map((item,key)=>{
                return (
                  <li key={key} className="option">
                    <a onClick={()=>{
                      this.onChange(item);
                      this.refs.select.hide();
                    }}>
                      <span>{item.label}</span>
                    </a>
                  </li>
                )
              })
            }
          </ul>
        </Dropdown>
        {
          hint ? <div className="select-hint">{hint}</div> : null
        }
      </div>
    )
  }
}