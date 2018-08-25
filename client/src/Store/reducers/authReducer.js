import { SET_USER, CLEAR_AUTH } from "../actions/types";

const INITIAL = {
  hasToken: sessionStorage.token ? true : false
};

export default (state = INITIAL, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload, hasToken: action.hasToken };
    case CLEAR_AUTH:
      return { ...state, user: "", hasToken: false };
    default:
      return state;
  }
};
