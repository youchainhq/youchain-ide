import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../actions";
import {initLocalStorage} from "../common/utils";

import Notify from "../components/vendors/notify";

class App extends Component {
  constructor(props) {
    super(props);

    initLocalStorage();

    this.onShowMsg = this.onShowMsg.bind(this);

    if (process.env.NODE_ENV !== "development") {
      window.onbeforeunload = () => {
        return "确定离开当前页面吗？";
      }
    }

    this.onClearBeforeUnload = this.onClearBeforeUnload.bind(this);
  }

  onClearBeforeUnload(){
    window.onbeforeunload = null;
  }

  componentWillReceiveProps(props) {
    const { ui: { type, request,data } } = props.state;

    switch (type) {
      case actions.types.REQUEST_SUCCESSFUL:
        this.requestDidSuccess(request);
        break;
      case actions.types.REQUEST_FAILED:
      case actions.types.SHOW_TOAST:
        if (data.msg) {
          this.refs.notify.addItem({
            type: data.type || "error",
            msg: data.msg
          });

          _.delay(() => {
            this.props.actions.clearToast({
              type: actions.types.CLEAR_TOAST
            });
          }, 2000);
        }
        break;
      case actions.types.CLEAR_TOAST:
        this.refs.notify.removeAll();
        break;
      default:
        break;
    }
  }

  requestDidSuccess(type) {

  }

  onShowMsg(msg, type = "info") {
    this.props.actions.showToast({
      type: actions.types.SHOW_TOAST,
      data: {
        type: type,
        msg: msg
      }
    });
  }

  render() {
    const { ui } = this.props.state;
    const actions = this.props.actions;

    const params = this.props.location.query;
    const version = params.version;

    return (
      <div>
        <div>
          {React.cloneElement(this.props.children, {
            state: this.props.state,
            actions: actions,
            version: version,
            onClearBeforeUnload: this.onClearBeforeUnload,
            onShowMsg: this.onShowMsg
          })}
        </div>
        <Notify ref="notify" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
