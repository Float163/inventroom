import React, { Component } from "react";
import { Link } from "react-router-dom";

import Bar from "../components/Bar.jsx";

export default class IndexPage extends Component {
  onClick() {
    alert("click");
  }

  render() {
    return <div>
      <Bar />
      <h1>Inventroom</h1>
      <p>Welcome to Inventroom</p>
      <Link to="/panel">Go to panel</Link>
    </div>
  }
} 
