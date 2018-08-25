import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "./../../Store/actions";
import TextFieldGroup from "./../FormFields/TextFieldGroup";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
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
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    };
    this.props.userRegister(data, this.props.history);
  };

  render() {
    const { errors } = this.state;
    return (
      <form onSubmit={this.Submit}>
        <h3>Register</h3>
        <TextFieldGroup
          name="username"
          placeholder="User Name"
          value={this.state.username}
          onChange={this.onChange}
          error={errors.username}
        />
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
          type="password"
          placeholder="Password"
          value={this.state.password}
          onChange={this.onChange}
          error={errors.password}
        />
        <button type="submit">Register Now</button>
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
)(Register);
