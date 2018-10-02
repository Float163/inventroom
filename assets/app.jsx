"use strict";

import { createStore, applyMiddleware, combineReducers } from "redux";
import React from "react";
import ReactDOM, { hydrate, render } from 'react-dom'

import createSagaMiddleware from "redux-saga";
import { BrowserRouter } from "react-router-dom";

import routes from "./routes.jsx";
import InventroomClue from "./services/InventroomClue.js";

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const store = createStore(combineReducers({
  "InventroomClue": InventroomClue.reducer
}), applyMiddleware(sagaMiddleware));

sagaMiddleware.run(InventroomClue.saga);

import './app.scss';

render(
  <BrowserRouter>
    { routes(store) }
  </BrowserRouter>,
  document.getElementById("root")
);
