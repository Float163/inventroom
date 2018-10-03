import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import InventroomClue, { Clue, queries } from "../services/InventroomClue";
import { connect } from "react-redux";
import { parseSearchHash } from "../services/Utils";

import Bar from "../components/Bar.jsx";
import Button from '@material-ui/core/Button';
import NoSsr from '@material-ui/core/NoSsr';

import { meSelector, meRefresh } from "../services/Me";

const getRedirectURI = () => `${typeof window !== "undefined" && window.location.origin}/login`;
const propsToVKCode = (props) => {
  const searchHash = parseSearchHash(props.location.search);
  return searchHash.code && `vk:${searchHash.code}`;
};
const propsToVKClue = props => {
  return {
    identity: "auth",
    query: queries.FIND_BY_ID,
    id: propsToVKCode(props),
    search: {
      redirectURI: getRedirectURI()
    }
  };
};
const vkSelector = InventroomClue.selectors.byClue(propsToVKClue);

@connect(
  (state, props) => ({
    vkCode: propsToVKCode(props),
    vkItem: vkSelector(state, props),
    me: meSelector(state)
  }),
  {
    requestVKItem: InventroomClue.actions.byClue,
    meRefresh
  }
)
export default class LoginPage extends Component {
  componentDidMount() {
    if (this.props.vkCode) {
      this.props.requestVKItem(propsToVKClue(this.props));
    }
  }

  componentDidUpdate(prevProps) {
    const hadVKItem = prevProps.vkItem && prevProps.vkItem.success;
    const hasVKItem = this.props.vkItem && this.props.vkItem.success;
    if (hasVKItem && !hadVKItem) {
      this.props.meRefresh();
    }
  }

  renderMe() {
    return <Fragment>
      <p>Вы авторизованы как { this.props.me.name }</p>
      <Link to="/my">
        <Button variant="contained">Перейти в ЛК</Button>
      </Link>
    </Fragment>
  }

  renderLogin() {
    const redirectURI = getRedirectURI();
    const appId = this.props.vkAppId;
    const vkURL =
      `https://oauth.vk.com/authorize?display=page&redirect_uri=${redirectURI}&client_id=${appId}&response_type=code&v=5.74`;

    return <Fragment>
      <p>
        На данный момент регистрация поддерживается только через социальную сеть "В Контакте".
      </p>
      <NoSsr>
      <a href={ vkURL }>
        <Button variant="contained" color="primary">Войти через VK</Button>
      </a>
      </NoSsr>
    </Fragment>
  }

  render() {
    return <div>
      <Bar />
      {
        this.props.vkCode
        && this.props.vkItem
        && this.props.vkItem.success
        && <Redirect to="/login" />
      }
      {
        this.props.me
          ? this.renderMe()
          : this.renderLogin()
      }
    </div>
  }
}


