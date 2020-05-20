import "./style.less";
import React, {PureComponent} from 'react';
import classnames from "classnames";
import Button from "../button";

export default class Modal extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      hideFooter,
      larger,
      confirmText,
      children,
      onDismiss,
      onConfirm
    } = this.props;

    const dislogClass = classnames({
      "modal-dialog":true,
      "modal-lg":larger
    });

    return (
      <div className="modal fade in">
        <div className="modal-backdrop fade in"/>
        <div className={dislogClass}>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                {title}
              </h4>
              <a onClick={onDismiss}><i className="fa icon-close"/></a>
            </div>
            <div className="modal-body">
              {children}
            </div>
            {
              hideFooter ? null :
                <div className="modal-footer">
                  <Button
                    text={confirmText || "确认"}
                    type="primary"
                    large={true}
                    onClick={onConfirm}
                  />
                </div>
            }
          </div>
        </div>
      </div>
    )
  }
}