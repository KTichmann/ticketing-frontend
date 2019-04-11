import React from "react"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import PropTypes from "prop-types"

const Form = props => (
  <form style={{ paddingLeft: "2rem" }}>
    <p>{props.usernameErrorMessage}</p>
    <TextField
      style={{ display: "block" }}
      id="username"
      label="Username"
      margin="normal"
      variant="outlined"
      error={props.usernameError}
    />
    {props.email ? (
      <div>
        <p>{props.emailErrorMessage}</p>
        <TextField
          style={{ display: "block" }}
          id="email"
          label="Email"
          type="email"
          margin="normal"
          error={props.emailError}
          variant="outlined"
        />
      </div>
    ) : (
      false
    )}
    <p>{props.passwordErrorMessage}</p>
    <TextField
      style={{ display: "block" }}
      id="password"
      label="Password"
      type="password"
      margin="normal"
      variant="outlined"
      error={props.passwordError}
    />
    <Button
      variant="contained"
      color="primary"
      type="submit"
      style={{ marginLeft: "8rem", marginTop: "1rem" }}
      onClick={e => props.handleClick(e)}
    >
      {props.buttonText}
    </Button>
  </form>
)

Form.propTypes = {
  usernameErrorMessage: PropTypes.string,
  passwordErrorMessage: PropTypes.string,
  emailErrorMessage: PropTypes.string,
  usernameError: PropTypes.bool,
  passwordError: PropTypes.bool,
  emailError: PropTypes.bool,
}

Form.defaultProps = {
  usernameErrorMessage: "Error",
  passwordErrorMessage: "Error",
  emailErrorMessage: "Error",
  usernameError: false,
  passwordError: false,
  emailError: false,
}

export default Form
