import React from "react";
import jwt from "jwt-simple";
import { Provider } from "react-redux";
import store from "./Store/store";
import config from "./config/siteconfigs";
import { setUser } from "./Store/actions";

// Authorization Server Token
import setAuthToken from "./Components/Auth/Authorization/setAuthToken";

export default ({ children }) => {
  if (sessionStorage.token) {
    let token = sessionStorage.token;
    setAuthToken(token);
    const decoded_token = jwt.decode(token, config.phrases.secret);
    store.dispatch(setUser(decoded_token));
  }
  return <Provider store={store}>{children}</Provider>;
};
