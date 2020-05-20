import React, { PureComponent } from "react";
import classnames from "classnames";

const styles = {
  minWidth: 150,
  textTransform:"none"
};

class Button extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { text,children, type, block, large, onClick ,disabled} = this.props;

    const className = classnames({
      btn: true,
      "btn-default": type === "default",
      "btn-primary": type === "primary",
      "btn-danger": type === "danger",
      "btn-success":type === "success",
      "btn-warning": type === "warning",
      "btn-block": !!block,
      "btn-lg": !!large
    });

    return (
      <div className="form-group">
        <button
          type="button"
          className={className}
          style={styles}
          disabled={!!disabled}
          onClick={onClick}
        >
          {text || children}
        </button>
      </div>
    );
  }
}
export default Button;
