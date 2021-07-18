import { Link } from "react-router-dom";
import { useRef } from "react";
import useAuth from "../../hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import "./AuthForm.css";
const Login = () => {
  const { login } = useAuth();
  const dispatch = useDispatch();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  
  const isEmailExistent = useSelector((state) => state.isErrorEmailNotFound);
  const isPasswordValid = useSelector((state) => state.isPasswordValid);

  const loginHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    dispatch({type:'EMAIL_NOT_FOUND',boolean:false});
    dispatch({type:'INVALID_PASSWORD',boolean:false});
    login(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBSIZSdghkjvJ_8hJt-FAicfpHNpUAVsPI",
      enteredEmail,
      enteredPassword
    );
   
  };
  return (
    <form onSubmit={loginHandler}>
      <div>
        <h1>Login</h1>
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" ref={emailInputRef} required />
        {isEmailExistent && <p>Invalid email</p>}
        <label htmlFor="password">Password</label>
        <input type="password" ref={passwordInputRef} required />
        {isPasswordValid && <p>Invalid password</p>}
        <div>
          <input type="submit" value="Sign in" />
          <Link to="/signup">Create account</Link>
        </div>
      </div>
    </form>
  );
};
export default Login;
