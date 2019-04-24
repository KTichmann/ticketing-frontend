import React from "react"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Form from "../../components/form"
const { API_URL } = process.env

class LogInPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      usernameError: false,
      passwordError: false,
      usernameErrorMessage: "",
      passwordErrorMessage: "",
    }

    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(e) {
    e.preventDefault()
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value

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

    if (password && username) {
      let url = `${API_URL}/user/authenticate`
      let data = `username=${username}&password=${password}`

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
            window.sessionStorage.setItem("ticketing_token", res.token)
            window.sessionStorage.setItem("ticketing_username", username)
            window.location.href = "/"
          } else if (res.message.includes("email not verified")) {
            this.setState({
              usernameErrorMessage: "Email not verified",
            })
          } else {
            this.setState({
              usernameError: true,
              passwordError: true,
              usernameErrorMessage: "Username or Password Incorrect",
            })
          }
        })
        .catch(error => console.log("error: ", error))
    }
  }
  render() {
    return (
      <Layout>
        <h1>Log In</h1>
        <div className="user-form">
          <Form
            usernameError={this.state.usernameError}
            passwordError={this.state.passwordError}
            usernameErrorMessage={this.state.usernameErrorMessage}
            passwordErrorMessage={this.state.passwordErrorMessage}
            handleClick={this.handleClick}
            buttonText="Log In"
          />
          <div className="login-message">
            Don't have an account? <Link to="/user/sign-up">Sign up here</Link>
          </div>
        </div>
      </Layout>
    )
  }
}

export default LogInPage
