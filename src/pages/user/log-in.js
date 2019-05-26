import React from "react"
import { Link } from "gatsby"
import Form from "../../components/form"
import { StylesProvider, createGenerateClassName } from "@material-ui/styles"
const { API_URL } = process.env

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: "c",
})

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
            document.getElementById("redirect_to_home").click()
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
      <div
        style={{
          fontFamily: "Lato",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -80%)",
          position: "absolute",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Log In</h1>
        <p style={{ textAlign: "center" }}>
          Use the details below to test: <br /> Username: testUser <br />
          Password: testUser
        </p>
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
        <Link to="/" id="redirect_to_home" />
      </div>
    )
  }
}

export default LogInPage
