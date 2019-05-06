import React from "react"
import Layout from "../../components/layout"
import { withStyles } from "@material-ui/core/styles"
import PropTypes from "prop-types"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import FormHelperText from "@material-ui/core/FormHelperText"

const { API_URL } = process.env

const styles = theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "60%",
    margin: "0px auto",
  },
})

class CreatePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      description: "",
      addUser: "",
      users: [],
      emptyTitle: false,
      emptyDescription: false,
      emtpyTitleText: "",
      emptyDescriptionText: "",
    }

    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(whichOne, e) {
    let stateObj = {}
    stateObj[whichOne] = e.target.value
    this.setState(stateObj)
  }
  addUser() {
    if (this.state.users.indexOf(this.state.addUser) > -1) {
    } else {
      //check if user exists:
      fetch(`${API_URL}/user/check-user/${this.state.addUser}`)
        .then(result => result.json())
        .then(result => {
          if (result.userExists) {
            this.setState(prevState => ({
              users: [...prevState.users, prevState.addUser],
            }))
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  handleSubmit(e) {
    e.preventDefault()
    this.setState({
      emptyTitle: false,
      emptyTitleText: "",
      emptyDescription: false,
      emptyDescriptionText: "",
    })
    if (this.state.title === "" || this.state.description === "") {
      if (this.state.title === "") {
        this.setState({
          emptyTitle: true,
          emptyTitleText: "Group title cannot be empty",
        })
      }
      if (this.state.description === "") {
        this.setState({
          emptyDescription: true,
          emptyDescriptionText: "Group description cannot be empty",
        })
      }
    } else {
      console.log(sessionStorage.getItem("ticketing_token"))
      const title = this.state.title
      const description = this.state.description
      const data = `title=${title}&description=${description}`
      fetch(`${API_URL}/group/create`, {
        method: "POST",
        headers: {
          Authorization: sessionStorage.getItem("ticketing_token"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      })
        .then(result => result.json())
        .then(result => {
          if (result.success) {
            this.state.users.map(user => {
              fetch(`${API_URL}/group/add/${user}`)
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  render() {
    const { classes } = this.props
    return (
      <Layout>
        <form className={classes.container}>
          <TextField
            error={this.state.emptyTitle}
            id="title"
            label="Title"
            className={classes.textField}
            value={this.state.title}
            margin="normal"
            variant="outlined"
            onChange={e => this.handleChange("title", e)}
          />
          <FormHelperText id="title-error-text">
            {this.state.emptyTitleText}
          </FormHelperText>

          <TextField
            error={this.state.emptyDescription}
            id="description"
            label="Description"
            className={classes.textField}
            value={this.state.description}
            margin="normal"
            variant="outlined"
            multiline
            rows="6"
            onChange={e => this.handleChange("description", e)}
          />
          <FormHelperText id="description-error-text">
            {this.state.emptyDescriptionText}
          </FormHelperText>
          <List className={classes.list}>
            {this.state.users.map(user => (
              <ListItem>
                <ListItemText key={user} style={{ marginBottom: "1rem" }}>
                  {user}
                </ListItemText>
              </ListItem>
            ))}
          </List>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextField
              id="add-user"
              label="Add a user"
              className={classes.addUser}
              value={this.state.addUser}
              margin="normal"
              variant="outlined"
              style={{ width: "65%" }}
              onChange={e => this.handleChange("addUser", e)}
            />
            <Button
              variant="contained"
              color="inherit"
              onClick={e => this.addUser()}
              style={{ width: "30%" }}
            >
              Add a user
            </Button>
          </div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: "1rem" }}
            onClick={e => this.handleSubmit(e)}
          >
            Create Group
          </Button>
        </form>
      </Layout>
    )
  }
}

CreatePage.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CreatePage)
