import "./style.less";
import React, { PureComponent } from "react";
import classnames from "classnames";

export default class Actions extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      leftHidden,
      rightHidden,
      onToggleSide,
      onChangeFontSize
    } = this.props;

    const leftClass = classnames({
      "fa":true,
      "icon-arrow-left": !leftHidden,
      "icon-arrow-right": leftHidden,
    });

    const rightClass = classnames({
      "fa":true,
      "icon-arrow-left": rightHidden,
      "icon-arrow-right": !rightHidden,
    });

    return (
      <div className="centerpanel-actions-wrapper">
        <a onClick={()=>{
          onToggleSide && onToggleSide("left");
        }}>
          <i className={leftClass}/>
        </a>
        <a onClick={()=>{
          onChangeFontSize && onChangeFontSize(1);
        }}>
          <i className="fa icon-plus"/>
        </a>
        <a onClick={()=>{
          onChangeFontSize && onChangeFontSize(-1);
        }}>
          <i className="fa icon-minus"/>
        </a>
        <a onClick={()=>{
          onToggleSide && onToggleSide("right");
        }}>
          <i className={rightClass}/>
        </a>
      </div>
    );
  }
}