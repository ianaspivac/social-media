import { createStore } from "redux";

const initialState = {
  token: localStorage.getItem("token"),
  isLoggedIn: !!localStorage.getItem("token"),
  isErrorEmailExists: false,
  isPasswordValid:false,
  isErrorEmailNotFound:false
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
    case "EMAIL_EXISTS":
      return {
        ...state,
        isErrorEmailExists: action.boolean,
      };
      case "EMAIL_NOT_FOUND":
      return {
        ...state,
        isErrorEmailNotFound: action.boolean,
      };
      case "INVALID_PASSWORD":
        return{...state,isPasswordValid:action.boolean};
    default:
      return state;
  }
};

const store = createStore(authReducer);
export default store;
