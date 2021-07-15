import redux, { createStore } from "redux";
const initialState = { token: "", isLoggedIn: false };

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {...state,token:action.token,isLoggedIn:true};
    case "LOGOUT":
      return {...state,token:'',isLoggedIn:false};
    default:
      return state;
  }
};
const store = createStore(authReducer);
export default store;
