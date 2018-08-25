import React from "react";
import { Route, Switch } from "react-router-dom";

// Components
import FrontPage from "./NonAuth/FrontPage";
import Header from "./Layout/Header";
import Login from "./NonAuth/Login";
import Register from "./NonAuth/Register";
import Dashboard from "./../Components/Auth/Dashboard";

// PrivateRoute
import PrivateRoute from "./../Components/Auth/Authorization/PrivateRoute";

const App = () => {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={FrontPage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <Route exact path="/logout" />
      </Switch>
    </div>
  );
};

export default App;
