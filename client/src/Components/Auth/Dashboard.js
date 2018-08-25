import React, { Component } from "react";
import { connect } from "react-redux";

class Dashboard extends Component {
  componentWillMount() {
    console.log(this.props);
  }
  render() {
    return (
      <div>
        <h3>
          Welcome, <b>{this.props.auth.user.username}</b>!
        </h3>
        <p>Your UserID is: {this.props.auth.user.id}</p>
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
)(Dashboard);
