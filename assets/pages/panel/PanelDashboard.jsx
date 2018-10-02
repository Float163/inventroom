import React, { Component } from "react";

import InventroomClue, { Clue, queries } from "../../services/InventroomClue";
import { connect } from "react-redux";
import Button from '@material-ui/core/Button';

const propsToSessionClue = props => ({ identity: "session", query: queries.FIND });
const sessionsSelector = InventroomClue.selectors.byClue(propsToSessionClue);

const createdSessionsSelector = InventroomClue.selectors.byClue(
  props => ({ identity: "session", query: queries.CREATE }),
  { marker: "dashboard-page" }
);

@connect(
  (state, props) => ({
    sessions: sessionsSelector(state, props),
    createdSessions: createdSessionsSelector(state, props)
  }),
  {
    loadSessions: InventroomClue.actions.byClue,
    createSession: InventroomClue.actions.byClue
  }
)
export default class PanelDashboard extends Component {
  componentDidMount() {
    this.props.loadSessions(propsToSessionClue(this.props));
  }

  onCreateSession = (event) => {
    this.props.createSession({
      identity: "session",
      query: queries.CREATE,
      data: {
        name: "Some name",
        description: "some description"
      }
    }, { marker: "dashboard-page" });
  };

  render() {
    return <div>
      <h1>Dashboard</h1>

      <Button variant="contained" color="primary" onClick={ this.onCreateSession }>Create session 2</Button>

      <h4>this.props.sessions</h4>
      <div style={{ whiteSpace: "pre" }}>
        { JSON.stringify(this.props.sessions, null, 2) }
      </div>
      <h4>this.props.createdSessions</h4>
      <div style={{ whiteSpace: "pre" }}>
        { JSON.stringify(this.props.createdSessions, null, 2) }
      </div>
    </div>
  }
}


