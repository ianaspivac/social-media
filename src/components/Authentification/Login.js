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
  const attempts =useSelector((state) => state.tooManyAttempts);

  const loginHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    dispatch({type:'EMAIL_NOT_FOUND',boolean:false});
    dispatch({type:'INVALID_PASSWORD',boolean:false});
    dispatch({type:'TOO_MANY_ATTEMPTS_TRY_LATER',boolean:false});
    login(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBSIZSdghkjvJ_8hJt-FAicfpHNpUAVsPI",
      enteredEmail,
      enteredPassword
    );
   
  };
  return (
    <form onSubmit={loginHandler} className="authentification-form">
      <div className="authentification-form__name" >
        <h1>Login</h1>
      </div>
      <div className="authentification-form__inputs">
        <input className={isEmailExistent ? 'invalid' : ''} type="email" ref={emailInputRef} placeholder="Email" required />
        {isEmailExistent && <p className="authentification-form__invalid">Invalid email</p>}
        <input className={isPasswordValid ? 'invalid' : ''}  type="password" ref={passwordInputRef} placeholder="Password" required />
        {isPasswordValid && <p className="authentification-form__invalid">Invalid password</p>}
        {attempts && <p className="authentification-form__invalid">Too many failed attempts, try again later.</p>}
        <div className="authentification-form__actions">
          <input type="submit" className="authentification-form__submit" value="Sign in" />
          <Link to="/signup" className="authentification-form__link">Create account</Link>
        </div>
      </div>
    </form>
  );
};
export default Login;
