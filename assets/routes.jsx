"use strict";

import React, { Fragment } from "react";

import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";

import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import My from "./pages/my/My.jsx";
import PanelDashboard from "./pages/panel/PanelDashboard.jsx";
import CssBaseline from '@material-ui/core/CssBaseline';

export default (store, constants) => {
  return <Provider store={store}>
    <Fragment>
      <CssBaseline />
      <Switch>
        <Route exact path="/"
               render={ props =>
                <Index
                  { ...props }
                /> }
        />
        <Route exact path="/panel"
               render={ props =>
                <PanelDashboard
                  { ...props }
                /> }
        />
        <Route exact path="/login"
               render={ props =>
                <Login
                  vkAppId={ constants.vkAppId }
                  { ...props }
                /> }
        />
        <Route exact path="/my"
               render={ props =>
                <My
                  { ...props }
                /> }
        />
      </Switch>
    </Fragment>
  </Provider>;
};
