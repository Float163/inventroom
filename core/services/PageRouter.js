const config = require("config");
const Router = require("koa-router");
const KoaStatic = require("koa-static");
require("babel-register")({
  presets: ["env", "react", "stage-0"],
  plugins: ["transform-decorators-legacy"],
  extensions: [".jsx"]
});
const routes = require("../../assets/routes.jsx").default;

import InventroomClue from "../../assets/services/InventroomClue.js";
import { StaticRouter } from "react-router";
import React from "react";
import { renderToString } from "react-dom/server";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { Helmet } from "react-helmet";


module.exports = class PageRouter extends Router {
  constructor() {
    super();
    this._setStaticRouting();
    this.get("*", this._servePages.bind(this));
  }

  async _setStaticRouting() {
    if (config.util.getEnv("NODE_ENV") === "development" && !Number(process.env.SERVER_ONLY)) {
      const webpack = require("webpack");
      const webpackDevMiddleware = require("koa-webpack-dev-middleware");
      const webpackConfig = require("../../webpack.dev.js");
      const webpackCompiler = webpack(webpackConfig);

      this.get("/bundle.js", webpackDevMiddleware(webpackCompiler, {
        stats: { colors: true }
      }));
    } else {
      this.use(KoaStatic("public"));
    }
  }

  _servePages(ctx) {
    const store = createStore(combineReducers({
      "InventroomClue": InventroomClue.reducer
    }));
    const routesElement = routes(store);

    const contents = renderToString(
      React.createElement(StaticRouter, { location: ctx.req.url }, routesElement)
    );
    const helmet = Helmet.renderStatic();

    const html = `
<!doctype html>
<html ${helmet.htmlAttributes.toString()}>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="shortcut icon" href="/img/favicon.ico">
    ${helmet.link.toString()}
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
        
    <link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Roboto:100,200,300,400,500,700,900" rel="stylesheet">
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    <div id="root">${ contents }</div>
  </body>
  <script src="/bundle.js"></script>
</html>
`;
    ctx.body = html;
  };
};
