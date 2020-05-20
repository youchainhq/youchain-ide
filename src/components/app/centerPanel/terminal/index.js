import "./style.less";
import React, { PureComponent } from "react";
import classnames from "classnames";
import ReactJson from 'react-json-view';

export default class Terminal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open:true,
      msg:[]
    };

    this.onOpen = this.onOpen.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onSetMsg = this.onSetMsg.bind(this);
  }

  onOpen(){
    const {open} = this.state;

    this.setState({
      open:!open
    });

    this.props.onToggleTerminal(open);
  }

  onClear(){
    this.setState({
      msg:[]
    });
  }

  onSetMsg(data){
    let msg = [...this.state.msg];
    msg.push(data);

    this.setState({
      msg
    });
  }

  renderItem(item){
    try{
      const src = JSON.parse(item);

      if(_.isPlainObject(src)){
        return (
          <ReactJson
            src={src}
            name={"Debug"}
            enableClipboard={false}
            displayObjectSize={false}
            displayDataTypes={false}
            collapsed={1}
          />
        )
      }
      else{
        return item;
      }
    }
    catch(e){
      if(/^(https:\/\/?(.*))$/.test(item)){
        return (
          <a target="_blank" href={item}>{item}</a>
        )
      }
      return item;
    }
  }

  render() {
    const {height} = this.props;
    const {open} = this.state;

    const sideClass = classnames({
      "fa":true,
      "icon-arrow-down":open,
      "icon-arrow-up":!open,
    });

    const bodyClass = classnames({
      "body":true,
      "hidden":!open
    });

    return (
      <div className="terminal-wrapper">
        <section className="header">
          <a onClick={this.onOpen}>
            <i className={sideClass}/>
          </a>
          <a onClick={this.onClear}>
            <i className="fa icon-clear"/>
          </a>
        </section>
        <section className={bodyClass} style={{height:height}}>
          {
            this.state.msg.map((item,key)=>{
              return (
                <div key={key}>
                  { this.renderItem(item) }
                </div>
              )
            })
          }
        </section>
      </div>
    );
  }
}
