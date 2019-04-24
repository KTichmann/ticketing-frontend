import React from "react"
import Layout from "../../components/layout"
import { withStyles } from "@material-ui/core/styles"
import PropTypes from "prop-types"
import TextField from "@material-ui/core/TextField"
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
    }

    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(whichOne, e) {
    const stateObj = {}
    stateObj[whichOne] = e.target.value
    this.setState(stateObj)
  }
  render() {
    const { classes } = this.props
    return (
      <Layout>
        <form className={classes.container}>
          <TextField
            id="title"
            label="Title"
            className={classes.textField}
            value={this.state.title}
            margin="normal"
            variant="outlined"
            onChange={e => this.handleChange("title", e)}
          />
          <TextField
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
        </form>
      </Layout>
    )
  }
}

CreatePage.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CreatePage)
