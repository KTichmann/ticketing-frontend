import PropTypes from "prop-types"
import React from "react"
import Drawer from "@material-ui/core/Drawer"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import Divider from "@material-ui/core/Divider"
import classNames from "classnames"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import List from "@material-ui/core/List"
import ListItemText from "@material-ui/core/ListItemText"
import MenuIcon from "@material-ui/icons/Menu"
import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import DashboardIcon from "@material-ui/icons/Dashboard"
import AddBoxIcon from "@material-ui/icons/AddBox"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount"
import Avatar from "@material-ui/core/Avatar"
import astronaut from "../images/avatar.png"
import Grid from "@material-ui/core/Grid"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core"
import { Link } from "gatsby"
import { connect } from "react-redux"
import { addGroups } from "../redux/actions/groups"
import withRoot from "../withRoot"

const { API_URL } = process.env

const drawerWidth = 240

const theme = createMuiTheme({
  typography: {
    fontFamily: "Lato",
  },
  overrides: {
    MuiTypography: {
      body1: {
        color: "white",
      },
      subheading: {
        color: "white",
      },
    },
  },
})

const styles = theme => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: ".5rem",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,1)",
    },
  },
  root: {
    display: "flex",
    color: "white !important",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#3A1772",
    padding: "0px",
    overflow: "hidden",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  avatarSection: {
    padding: "1rem",
    backgroundColor: "rgba(255, 255, 255, .15)",
    fontFamily: "Roboto Condensed",
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
  groupsSection: {
    boxShadow: "0px -2px 1px 1px rgba(0,0,0,.1)",
    paddingTop: "0px",
    height: "65%",
    overflow: "scroll",
  },
  group: {
    borderBottom: ".5px solid rgba(255,255,255,.1)",
    textAlign: "center",
    transition: "background-color .7s",
    "&:hover": {
      backgroundColor: "rgba(250, 250, 250, .2)",
      transition: "background-color .7s",
    },
  },
})
class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      groups: [],
    }
    this.fetchData = this.fetchData.bind(this)
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    fetch(`${API_URL}/group/list`, {
      headers: {
        Authorization: window.sessionStorage.getItem("ticketing_token"),
      },
    })
      .then(result => result.json())
      .then(result => {
        if (result.data) {
          this.props.dispatchAddGroups(result.data)
          this.setState({
            groups: this.props.data.groups,
          })
        }
      })
      .catch(error => console.log(error))
  }

  handleDrawerOpen = () => {
    this.setState({ open: true })
  }
  handleDrawerClose = () => {
    this.setState({ open: false })
  }
  componentDidUpdate() {
    const { open } = this.state

    open
      ? (document.getElementById(
          "mainContentLayout"
        ).style.margin = `6rem 3rem 6rem 15rem`)
      : (document.getElementById(
          "mainContentLayout"
        ).style.margin = `6rem 3rem`)
  }

  render() {
    const { open, groups } = this.state
    const classes = this.props.classes

    return (
      <MuiThemeProvider theme={theme}>
        <header className={classes.root}>
          <AppBar
            position="fixed"
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="Open Drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              {open ? (
                false
              ) : (
                <Typography variant="h6" color="inherit" noWrap>
                  Ticketing
                </Typography>
              )}
            </Toolbar>
          </AppBar>
          <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            className={classes.drawer}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <Typography
                variant="h6"
                color="inherit"
                noWrap
                style={{ left: "30px", position: "fixed", color: "white" }}
              >
                Ticketing
              </Typography>
              <IconButton color="inherit" onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              className={classes.avatarSection}
            >
              <Avatar
                alt="Remy"
                src={astronaut}
                className={classes.bigAvatar}
              />
              <Typography variant="h6" color="inherit" noWrap>
                {typeof window === "undefined" //Gatsby production build shenanigans
                  ? ""
                  : sessionStorage.getItem("ticketing_username")}
              </Typography>
            </Grid>
            <List className={classes.groupsSection}>
              {groups.map(group => (
                <Link
                  key={group.group_id}
                  to="/ticket-dashboard"
                  state={{ group_id: group.group_id }}
                >
                  <ListItem
                    id={group.group_id}
                    className={classes.group}
                    button
                    key={group.group_id}
                  >
                    <ListItemText
                      style={{ color: "white !important" }}
                      primary={group.title}
                    />
                  </ListItem>
                </Link>
              ))}
            </List>
            <List
              className={classes.drawerPaper}
              style={{ bottom: "0rem", position: "fixed", color: "white" }}
            >
              <Link to="/group/create">
                <ListItem button>
                  <ListItemIcon color="inherit">
                    <AddBoxIcon style={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Create a Group" />
                </ListItem>
              </Link>
              <Link to="/">
                <ListItem button>
                  <ListItemIcon color="inherit">
                    <DashboardIcon style={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              </Link>
              <div
                onClick={() => {
                  sessionStorage.removeItem("ticketing_token")
                  window.location.reload()
                }}
              >
                <ListItem button>
                  <ListItemIcon color="inherit">
                    <SupervisorAccountIcon style={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Log Out" />
                </ListItem>
              </div>
            </List>
          </Drawer>
        </header>
      </MuiThemeProvider>
    )
  }
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

const mapStateToProps = state => {
  return { data: state.groups }
}

const mapDispatchToProps = dispatch => {
  return { dispatchAddGroups: groups => dispatch(addGroups(groups)) }
}

const ConnectedHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)

export default withStyles(styles, { withTheme: true })(ConnectedHeader)
