import _ from "lodash";
import React, { PureComponent } from "react";

import {Modal,Input} from "../../../../components/vendors";

export default class Provider extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value:""
    };

    this.onInputValue = this.onInputValue.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onInputValue(e){
    this.setState({
      value:e.target.value
    });
  }

  onSubmit(){
    const {onConfirm} = this.props;
    const {value} = this.state;

    onConfirm && onConfirm(value);
  }

  render() {
    const {onDismiss} = this.props;

    return (
      <Modal
        title={"External node request"}
        onDismiss={onDismiss}
        onConfirm={this.onSubmit}
      >
        <p>YOUChain Provider Endpoint</p>
        <Input
          type="text"
          placeholder="http://localhost:8545"
          value={this.state.value}
          onChange={this.onInputValue}
        />
      </Modal>
    );
  }
}