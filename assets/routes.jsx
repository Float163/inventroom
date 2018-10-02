"use strict";

import React from "react";

import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";

import Index from "./pages/index.jsx";
import PanelDashboard from "./pages/panel/PanelDashboard.jsx";

export default (store) => {
  return <Provider store={store}>
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
    </Switch>
  </Provider>;
};
