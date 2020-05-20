import "./style.less";

import React, { PureComponent } from "react";

import classnames from "classnames";

class Input extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      focus: false,
      error: false,
      warning: false,
      success: false,
      msg: ""
    };

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus(e) {
    e && e.preventDefault();
    this.setState({
      focus: true
    });
  }

  onBlur() {
    this.setState({
      focus: false
    });

    const { onBlur, onValidate } = this.props;

    if (onBlur) {
      onBlur();
    }

    if (onValidate) {
      let validate = onValidate();

      if (validate.ret) {
        this.setState({
          error: false,
          success: true
        });
      } else {
        this.setState({
          error: true,
          success: false,
          msg: validate.msg
        });
      }
    }
  }

  render() {
    const {
      type,
      placeholder,
      disabled,
      value,
      onChange,
      onKeyUp
    } = this.props;

    const formClass = classnames({
      "form-group": true,
      "has-error": this.state.error,
      "has-warning": this.state.warning,
      "has-success": this.state.success,
    });

    const className = classnames({
      "fg-line": true,
      "fg-toggled": this.state.focus,
      disabled: !!disabled
    });

    return (
      <div className={formClass}>
        <div className={className}>
          <input
            type={type}
            className="form-control"
            disabled={disabled}
            value={value}
            placeholder={placeholder}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={onChange ? onChange : null}
            onKeyUp={onKeyUp ? onKeyUp : null}
            readOnly={onChange ? false : true}
          />
        </div>
        {(this.state.error || this.state.warning) && this.state.msg ? (
          <small className="help-block text-left">{this.state.msg}</small>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Input;
