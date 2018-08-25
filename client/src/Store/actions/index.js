import * as actions from "./types";
import axios from "axios";
import jwt from "jwt-simple";
import config from "./../../config/siteconfigs";
import setAuthToken from "../../Components/Auth/Authorization/setAuthToken";

export const userRegister = (data, history) => dispatch => {
  axios
    .post("/api/user/register", data)
    .then(res => {
      sessionStorage.setItem("token", res.data);
      setAuthToken(res.data);
      const decoded_token = jwt.decode(res.data, config.phrases.secret);
      dispatch(setUser(decoded_token));
      history.push("/dashboard");
    })
    .catch(errors => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: errors.response.data
      });
    });
};

export const userLogin = (data, history) => dispatch => {
  axios
    .post("/api/user/login", data)
    .then(res => {
      sessionStorage.setItem("token", res.data);
      setAuthToken(res.data);
      const decoded_token = jwt.decode(res.data, config.phrases.secret);
      dispatch(setUser(decoded_token));
      history.push("/dashboard");
    })
    .catch(errors => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: errors.response.data
      });
    });
};

export const Logout = () => dispatch => {
  sessionStorage.removeItem("token");
  dispatch({
    type: actions.SET_USER,
    payload: "",
    hasToken: false
  });
};

export const setUser = user => dispatch => {
  dispatch({
    type: actions.SET_USER,
    payload: user,
    hasToken: true
  });
};
