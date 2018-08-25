import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";

class FrontPage extends Component {
  state = {
    content: ""
  };
  renderPage = () => {
    axios.get("/frontpage").then(res => {
      this.setState({
        content: res.data
      });
    });
  };
  componentDidMount() {
    this.renderPage();
  }
  render() {
    let auth = this.props.auth.hasToken ? (
      <p>{this.props.auth.user.username} " is currently logged in."</p>
    ) : (
      "No User is Logged In..."
    );
    return (
      <div>
        <p>{this.state.content}</p>
        <p>{auth}</p>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(
  mapStateToProps,
  null
)(FrontPage);
