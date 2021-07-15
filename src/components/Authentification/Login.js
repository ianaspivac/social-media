import { Link } from "react-router-dom";
import {useRef} from 'react';
import useAuth from '../../hooks/useAuth';
import "./AuthForm.css";
const Login = () => {
    const { login } = useAuth();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();  
    const loginHandler = (event) => {
      event.preventDefault();
      //VALIDATEPASSWORD
      const enteredEmail = emailInputRef.current.value;
      const enteredPassword = passwordInputRef.current.value;
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
        <label htmlFor="password">Password</label>
        <input type="password" ref={passwordInputRef} required />
        <div>
          <input type="submit" value="Sign in" />
          <Link to="/signup">Create account</Link>
        </div>
      </div>
    </form>
  );
};
export default Login;
