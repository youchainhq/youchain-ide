import _ from "lodash";
import React, { PureComponent } from "react";
import classnames from "classnames";

import File from "./file";

export default class Tree extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open:true,
      menu:false,
      mask:false
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onRename = this.onRename.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  onMouseDown(e){
    switch (e.button) {
      case 0:
        if(!this.state.menu){
          this.setState({
            open: !this.state.open
          });
        }
        break;
      // case 2:
      //   this.setState({
      //     menu: !this.state.menu
      //   });
      //   _.delay(()=>{
      //     this.setState({
      //       mask: !this.state.mask
      //     })
      //   },100);
      //   break;
    }
  }

  onRename(e){
    e.preventDefault();

    this.onDismiss();
    const {data,onRename} = this.props;
    onRename && onRename("folder",data.name);
  }

  onRemove(e){
    e.preventDefault();

    this.onDismiss();
    const {data,onRemove} = this.props;
    onRemove && onRemove("folder",data.name);
  }

  onDismiss(){
    this.setState({
      menu: false,
      mask: false
    });
  }

  render() {
    const {data,currentFile,onSwitchFile,onRename,onRemove} = this.props;

    const {open,menu,mask} = this.state;

    const treeClass = classnames({
      "tree": true,
      "open": !!open
    });

    const folderCaret = classnames({
      "fa":true,
      "icon-angle-down": !!open,
      "icon-angle-right": !open
    });

    const folderOpen = classnames({
      "fa":true,
      "icon-folder-open": !!open,
      "icon-folder": !open
    });

    return (
      <article className={treeClass}>
        {
          mask ? <div
            className="menu-mask"
            onClick={this.onDismiss}/> : null
        }
        <div
          className="folder"
          onContextMenu={(e)=>{
            e.preventDefault();
          }}
          onMouseDown={this.onMouseDown}
        >
          <i className={folderCaret}/>
          <span>
            <i className={folderOpen}/>
            <label>{data.name}</label>
          </span>
          {
            menu ? <ul className="menu">
              <li>
                <a onClick={this.onRename}>重命名</a>
              </li>
              <li>
                <a onClick={this.onRemove}>删除</a>
              </li>
            </ul> : null
          }
        </div>
        <section className="files">
          {
            data.files.map((item,key)=>{
              return (
                <File
                  key={key}
                  data={item}
                  currentFile={currentFile}
                  onSwitchFile={onSwitchFile}
                  onRename={onRename}
                  onRemove={onRemove}
                />
              )
            })
          }
        </section>
      </article>
    );
  }
}