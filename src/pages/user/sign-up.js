import React from "react"
import { Link } from "gatsby"
import Form from "../../components/form"
import { withStyles } from "@material-ui/core/styles"

const { API_URL } = process.env

const styles = theme => ({})
class SignUpPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      usernameError: false,
      passwordError: false,
      emailError: false,
      usernameErrorMessage: "",
      emailErrorMessage: "",
      passwordErrorMessage: "",
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(e) {
    e.preventDefault()
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const email = document.getElementById("email").value
    const checkEmailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/

    //START VALIDATION:
    //Make sure the username isn't empty
    if (!username) {
      this.setState({
        usernameError: true,
        usernameErrorMessage: "Username cannot be empty",
      })
    } else {
      this.setState({ usernameError: false, usernameErrorMessage: "" })
    }

    if (!password) {
      this.setState({
        passwordError: true,
        passwordErrorMessage: "Password cannot be empty",
      })
    } else {
      this.setState({ passwordError: false, passwordErrorMessage: "" })
    }

    if (!email) {
      this.setState({
        emailError: true,
        emailErrorMessage: "Email cannot be empty",
      })
    } else if (!email.match(checkEmailRegex)) {
      this.setState({
        emailError: true,
        emailErrorMessage: "Please input a valid email address",
      })
    }
    //END VALIDATION

    //START FETCH REQUEST
    if (password && username && email) {
      let url = `${API_URL}/user/sign-up`
      let data = `username=${username}&password=${password}&email=${email}`

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      })
        .then(res => res.json())
        .then(res => {
          console.log("res: ", res)
          if (res.success) {
            document.getElementById("relocate").click()
          } else if (res.message === "username taken") {
            this.setState({
              usernameError: true,
              usernameErrorMessage: "Username Taken",
            })
          } else {
            this.setState({
              usernameErrorMessage: "There was a problem signing you up",
            })
          }
        })
        .catch(error => console.log("error: ", error))
    }
    //END FETCH REQUEST
  }
  render() {
    return (
      <div
        style={{
          fontFamily: "Lato",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -80%)",
          position: "absolute",
        }}
      >
        <h1 style={{ textAlign: "center", fontFamily: "Lato" }}>Sign Up</h1>
        <div style={{ margin: "0px auto" }} className="user-form">
          <Form
            usernameError={this.state.usernameError}
            passwordError={this.state.passwordError}
            usernameErrorMessage={this.state.usernameErrorMessage}
            passwordErrorMessage={this.state.passwordErrorMessage}
            emailError={this.state.emailError}
            emailErrorMessage={this.state.emailErrorMessage}
            handleClick={this.handleClick}
            email={true}
            buttonText="Sign Up"
          />
          <div className="login-message" style={{ textAlign: "center" }}>
            Already a user? <Link to="/user/log-in">Log in here</Link>
          </div>
        </div>
        <Link to="/user/verify" id="relocate" />
      </div>
    )
  }
}

export default withStyles(styles)(SignUpPage)
