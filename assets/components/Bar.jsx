import React, { Component } from "react";

import { meSelector } from "../services/Me";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

@withStyles(styles)
@connect(
  (state, props) => ({
    me: meSelector(state)
  }),
  {}
)
export default class Bar extends Component {

  render() {
    const { classes } = this.props;

    return <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Link to="/"  className={classes.grow}>
            <Typography variant="title" style={{ color: "white" }}>
              Inventroom
            </Typography>
          </Link>
          {
            this.props.me
              ? <Link to="/my" style={{ textDecoration:"none" }}>
                <Chip
                  color="primary"
                  avatar={<Avatar alt={ this.props.me.name } src={ this.props.me.avatar } />}
                  label={ this.props.me.name }
                  style={{ color:"white", cursor: "pointer" }}
                />
              </Link>
              : <Link to="/login"><Button variant="flat" color="secondary" style={{ color:"white" }}>Войти</Button></Link>
          }
        </Toolbar>
      </AppBar>
    </div>
  }
}


