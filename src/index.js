/**
 * Created by sean@ihuanqu.com on 2018/8/30.
 */
import "./styles/main.less";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, browserHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import createRoutes from "./routes";
import configureStore from "./store";

let initState;

const init = () => {
  const store = configureStore(initState, browserHistory);
  //使 react-router 和 react-router-redux 两个库连接起来
  const history = syncHistoryWithStore(browserHistory, store);
  const routes = createRoutes(store);

  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>{routes}</Router>
    </Provider>,
    document.getElementById("app")
  );
};

init();
