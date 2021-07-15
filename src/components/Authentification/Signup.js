import { Link} from "react-router-dom";
import { useRef } from "react";
import "./AuthForm.css";
import useAuth from "../../hooks/useAuth";
const Signup = () => {
  const  {login}  = useAuth();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const signupHandler = (event) => {
    event.preventDefault();
    //VALIDATEPASSWORD
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    login(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBSIZSdghkjvJ_8hJt-FAicfpHNpUAVsPI",
      enteredEmail,
      enteredPassword
    );
  };
  return (
    <form onSubmit={signupHandler}>
      <div>
        <h1>Sign up</h1>
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" ref={emailInputRef} required />
        <label htmlFor="password">Password</label>
        <input type="password" ref={passwordInputRef} required />
        <label htmlFor="password-confirmation">Confirm Password</label>
        <input type="password" ref={confirmPasswordInputRef} required />
        <div>
          <input type="submit" value="Sign up" />
          <Link to="/login">Have account already?</Link>
        </div>
      </div>
    </form>
  );
};
export default Signup;
