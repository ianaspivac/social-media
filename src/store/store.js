import  { createStore } from "redux";

const initialState = { token: localStorage.getItem("token"), isLoggedIn: !!localStorage.getItem("token")};
//have to add expiration time for token
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, token: action.token, isLoggedIn: true };
    case "LOGOUT":
      return { ...state, token: "", isLoggedIn: false };
    default:
      return state;
  }
};
const store = createStore(authReducer);
export default store;
