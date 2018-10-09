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

import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';


const propsToSessionClue = props => ({ identity: "session", query: queries.FIND });
const sessionsSelector = InventroomClue.selectors.byClue(propsToSessionClue);

const createdSessionsSelector = InventroomClue.selectors.byClue(
  props => ({ identity: "session", query: queries.CREATE }),
  { marker: "dashboard-page" }
);

const styles = theme => ({
    paper: {
//            height: 240,
        marginTop: theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit * 2,
        width: 250,
    },
    inputField: {
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        width: 200,
    },
    button: {
        margin: theme.spacing.unit * 2,
    }
});


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

class PanelDashboard extends Component {

  constructor(props) {
      super(props);
      this.state = {name : '', description :''}
  }

  componentDidMount() {
    this.props.loadSessions(propsToSessionClue(this.props));
  }

  onCreateSession = (event) => {
    this.props.createSession({
      identity: "session",
      query: queries.CREATE,
      data: {
        name: this.state.name,
        description: this.state.description
      }
    }, { marker: "dashboard-page" });
  };

  onChange = (event) => {
    const name = event.target.name;
    this.state[name] = event.target.value;
    this.forceUpdate();
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
              {Array.from(this.props.sessions.data).map((session, index) => {
                  return (
                      <TableRow key={index}>
                          <TableCell component="th" scope="row">{session.name}</TableCell>
                          <TableCell>{session.description}</TableCell>
                          <TableCell>  <Button variant="contained" color="secondary" style={{ marginTop: 2 }}> Action </Button>  </TableCell>
                      </TableRow>
                  )
              })}
          </TableBody>
      </Table>;
  }

  renderCreateSession() {
      const { classes } = this.props;

      return <Paper className={classes.paper}>
          <h2>New session</h2>
          <Input
              className={classes.inputField}
              name='name'
              placeholder="Name"
              inputProps={{
                  'aria-label': 'Name',
              }}
              onChange={this.onChange.bind(this)}
          />
          <Input
              className={classes.inputField}
              name='description'
              placeholder="Description"
              inputProps={{
                  'aria-label': 'Description',
              }}
              onChange={this.onChange.bind(this)}
          />
          <Button className={classes.button} variant="contained" color="primary" onClick={ this.onCreateSession }>Create session</Button>
      </Paper>
  }

  render() {
    return <div>
      <Bar />
      <h1>Dashboard</h1>
      {
        (this.props.sessions && this.props.sessions.success)
        ? this.renderSession()
        : (this.props.sessions && this.props.sessions.pending)
        ? <Paper>
          <h3>Load data</h3>
          <p>Loading</p>
          </Paper>
        : (this.props.sessions && this.props.sessions.error)
        ? <Paper>
          <h3>Error</h3>
          <p>Error info:</p>
          </Paper>
        : ''
      }

      {this.renderCreateSession()}

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

export default withStyles(styles)(PanelDashboard);