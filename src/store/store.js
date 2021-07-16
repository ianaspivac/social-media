import { createStore } from "redux";

const initialState = {
  token: localStorage.getItem("token"),
  isLoggedIn: !!localStorage.getItem("token"),
  isErrorEmail: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        token: action.token,
        isLoggedIn: true
      };
    case "LOGOUT":
      return { ...state, token: "", isLoggedIn: false };
    case "IS_ERROR":
      return {
        ...state,
        isErrorEmail: action.boolean,
      };
    default:
      return state;
  }
};

const store = createStore(authReducer);
export default store;
