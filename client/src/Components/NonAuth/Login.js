import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "./../../Store/actions";
import TextFieldGroup from "./../FormFields/TextFieldGroup";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  Submit = e => {
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.userLogin(data, this.props.history);
  };

  render() {
    const { errors } = this.state;
    return (
      <form onSubmit={this.Submit}>
        <h3>Login</h3>
        <TextFieldGroup
          name="email"
          type="email"
          placeholder="Email Address"
          value={this.state.email}
          onChange={this.onChange}
          error={errors.email}
        />
        <TextFieldGroup
          name="password"
          type="Password"
          placeholder="Password"
          value={this.state.password}
          onChange={this.onChange}
          error={errors.password}
        />
        <button type="submit">Login</button>
      </form>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    errors: state.errors
  };
};

export default connect(
  mapStateToProps,
  actions
)(Login);
