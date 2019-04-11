import React from "react"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Form from "../../components/form"

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

    if (password && username && email) {
      let url = "https://localhost:5000/user/sign-up"
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
        .catch(error => console.log(error))
    }
  }
  render() {
    return (
      <Layout>
        <h1>Sign Up</h1>
        <div className="user-form">
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
          <div className="login-message">
            Already a user? <Link to="/user/log-in">Log in here</Link>
          </div>
        </div>
        <Link
          to="/user/log-in"
          id="relocate"
          state={{ signed_up: true }}
          style={{ display: "none" }}
        />
      </Layout>
    )
  }
}

export default SignUpPage
