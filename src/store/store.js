import { createStore } from "redux";

const initialState = {
  isLoggedIn: !!localStorage.getItem("token"),
  userInfo: {
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
    email: localStorage.getItem("email"),
    photoUrl: localStorage.getItem("photoUrl"),
    displayName: localStorage.getItem("displayName"),
  },

  isErrorEmailExists: false,
  isPasswordValid: false,
  isErrorEmailNotFound: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        userInfo: {
          token: action.payload.token,
          userId: action.payload.userId,
          email: action.payload.email,
          photoUrl: action.payload.photoUrl,
          displayName: action.payload.displayName,
        },
        isLoggedIn: true,
      };
    case "LOGOUT":
      return {
        ...state,
        userInfo: {
          token: "",
          userId: "",
          email: "",
          photoUrl: "",
          displayName: "",
        },
        isLoggedIn: false,
      };
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
      return { ...state, isPasswordValid: action.boolean };
    default:
      return state;
  }
};

const store = createStore(authReducer);
export default store;
