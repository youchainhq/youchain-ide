import React, {PureComponent} from 'react';
import Button from "../button";

export default class Confirm extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {title,desc,children,onDismiss,onConfirm} = this.props;

    return (
      <div className="modal fade in">
        <div className="modal-backdrop fade in"/>
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                {title}
              </h4>
              <a onClick={onDismiss}><i className="fa icon-close"/></a>
            </div>
            <div className="modal-body text-center">
              {
                children ? children : desc
              }
            </div>
            <div className="modal-footer">
              <Button
                text="确认"
                type="primary"
                large={true}
                onClick={onConfirm}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}