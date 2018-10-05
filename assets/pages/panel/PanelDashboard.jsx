import React, { Component } from "react";

import InventroomClue, { Clue, queries } from "../../services/InventroomClue";
import { meSelector } from "../../services/Me";
import { connect } from "react-redux";
import Bar from "../../components/Bar.jsx";

import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';



const propsToSessionClue = props => ({ identity: "session", query: queries.FIND });
const sessionsSelector = InventroomClue.selectors.byClue(propsToSessionClue);

const createdSessionsSelector = InventroomClue.selectors.byClue(
  props => ({ identity: "session", query: queries.CREATE }),
  { marker: "dashboard-page" }
);

@connect(
  (state, props) => ({
    sessions: sessionsSelector(state, props),
    createdSessions: createdSessionsSelector(state, props),
    me: meSelector(state)
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

  renderSession() {
    return <Table>
          <TableHead>
              <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Action</TableCell>
              </TableRow>
          </TableHead>
          <TableBody>
              {Array.from(this.props.sessions.data).map(session => {
                  return (
                      <TableRow key={1}>
                          <TableCell component="th" scope="row">{session.name}</TableCell>
                          <TableCell>{session.description}</TableCell>
                          <TableCell>  <Button variant="contained" color="secondary" style={{marginTop: 2 + 'px'}}> Action </Button>  </TableCell>
                      </TableRow>
                  )
              })}
          </TableBody>
      </Table>;
  }

  render() {
    return <div>
      <Bar />
      <h1>Dashboard</h1>
        {(  this.props.sessions && this.props.sessions.success) ?
                this.renderSession()
            : (this.props.sessions && this.props.sessions.pending) ?
                <Paper>
                    <h3>Load data</h3>
                    <p>Loading</p>
                </Paper>
            : (this.props.sessions && this.props.sessions.error) ?
                <Paper>
                  <h3>Error</h3>
                  <p>Error info:</p>
                </Paper>
            : ''
        }

      <Button variant="contained" color="primary" onClick={ this.onCreateSession }>Create session 2</Button>

      <h4>this.props.me</h4>
      <div style={{ whiteSpace: "pre" }}>
        { JSON.stringify(this.props.me, null, 2) }
      </div>
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


