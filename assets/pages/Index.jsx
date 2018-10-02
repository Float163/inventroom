import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class IndexPage extends Component {
  onClick() {
    alert("click");
  }

  render() {
    return <div>
      <h1>Hello world</h1>
      <br/>
      <Link to="/panel">Inventroom index page</Link>
      <br/>
      <button onClick={ this.onClick }>CLICK ME</button>
    </div>
  }
} 
