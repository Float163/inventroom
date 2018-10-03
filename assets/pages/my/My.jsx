import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Bar from "../../components/Bar.jsx";
import Button from '@material-ui/core/Button';
import NoSsr from '@material-ui/core/NoSsr';

import { meSelector, meRefresh } from "../../services/Me";

@connect(
  (state, props) => ({
    me: meSelector(state)
  }),
  {
    meRefresh
  }
)
export default class My extends Component {
  onLogout = () => {
    const d = new Date();
    d.setTime(d.getTime() - (1000 * 60 * 60 * 24));
    const expires = "expires=" + d.toGMTString();
    window.document.cookie = `jwt=; ${expires};path=/`;

    this.props.meRefresh();
  };

  renderMe() {
    return <Fragment>
      <p>
        Вы вошли как { this.props.me.name }
      </p>
      <Button onClick={ this.onLogout }>Выйти</Button>
    </Fragment>;
  }

  render() {
    return <div>
      <Bar />
      <h1>Личный кабинет</h1>
      {
        this.props.me
          ? this.renderMe()
          : <NoSsr><Redirect to="/login" /></NoSsr>
      }
    </div>
  }
}


