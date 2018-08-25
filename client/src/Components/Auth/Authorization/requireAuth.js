import React, { Component } from "react";
import { connect } from "react-redux";

export default ChildComponent => {
  class ComposedComponent extends Component {
    // Our component was just rendered
    componentDidMount() {
      this.NavigateAway();
    }
    // Our component just got updated...
    componentDidUpdate() {
      this.NavigateAway();
    }

    NavigateAway() {
      if (!this.props.auth) {
        this.props.history.push("/");
      }
    }

    render() {
      return <ChildComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => {
    return {
      auth: state.auth.token
    };
  };

  return connect(
    mapStateToProps,
    null
  )(ComposedComponent);
};
