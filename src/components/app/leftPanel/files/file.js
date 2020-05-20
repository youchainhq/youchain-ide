import _ from "lodash";
import React, { PureComponent } from "react";
import classnames from "classnames";

export default class File extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      menu:false,
      mask:false
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onRename = this.onRename.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  onMouseDown(e){
    e.preventDefault();

    switch (e.button) {
      case 0:
        if(!this.state.menu){

        }
        break;
      case 2:
        this.setState({
          menu: !this.state.menu
        });
        _.delay(()=>{
          this.setState({
            mask: !this.state.mask
          })
        },100);
        break;
    }
  }

  onRename(e){
    e.preventDefault();

    this.onDismiss();
    const {data,onRename} = this.props;
    onRename && onRename("file",data.name);
  }

  onRemove(e){
    e.preventDefault();

    this.onDismiss();
    const {data,onRemove} = this.props;
    onRemove && onRemove("file",data.name);
  }

  onDismiss(){
    this.setState({
      menu: false,
      mask: false
    });
  }

  render() {
    const {data,currentFile,onSwitchFile} = this.props;
    const {menu,mask} = this.state;

    const fileClass = classnames({
      "file":true,
      "active":currentFile && currentFile.name === data.name
    });

    return (
      <div
        className={fileClass}
        onContextMenu={(e)=>{
          e.preventDefault();
        }}
        onMouseDown={this.onMouseDown}
        onClick={(e)=>{
          e.preventDefault();
          if(currentFile.name !== data.name){
            onSwitchFile && onSwitchFile(data);
          }
        }}
      >
        {
          mask ? <div
            className="menu-mask"
            onClick={this.onDismiss}/> : null
        }
        <i className="fa icon-file"/>
        <label>{data.name}</label>

        {
          menu ? <ul className="menu file">
            <li>
              <a onClick={this.onRename}>重命名</a>
            </li>
            <li>
              <a onClick={this.onRemove}>删除</a>
            </li>
          </ul> : null
        }
      </div>
    );
  }
}