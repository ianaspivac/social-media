import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {useSelector} from 'react-redux';
import "./AuthForm.css";
import useAuth from "../../hooks/useAuth";
const Signup = () => {
  const isEmailExistent =useSelector((state)=>state.isErrorEmail);
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [matchPass, setMatchPass] = useState();
  const [lengthPass, setLengthPass] = useState();
  const [validEmail, setValidEmail] = useState();
  const [disable, setDisable] = useState(false);

  const validatingForm = () => {
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    setValidEmail(!pattern.test(email));
    setMatchPass(password !== confirmPassword);
    setLengthPass(password.length < 6);
    return (matchPass || lengthPass || validEmail);
  };
  useEffect(() => {
    setDisable(validatingForm());
  }, [validatingForm]);

  const signupHandler = (event) => {
    event.preventDefault();
    if (!disable) {
      login(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBSIZSdghkjvJ_8hJt-FAicfpHNpUAVsPI",
        email,
        password
      );
    }
  };
  const emailHandler = (event) => {
    setEmail(event.target.value);
  };
  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };
  const confirmPasswordHandler = (event) => {
    setConfirmPassword(event.target.value);
  };
  return (
    <form onSubmit={signupHandler}>
      <div>
        <h1>Sign up</h1>
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" value={email} onChange={emailHandler} required />
        {isEmailExistent && <p>Email exists already</p>}
        {validEmail && <p>Email is not valid</p>}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={passwordHandler}
          required
        />
        {lengthPass && <p>Password is shorter than 6 characters</p>}
        <label htmlFor="password-confirmation">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={confirmPasswordHandler}
          required
        />
        {matchPass && <p>Passwords do not match</p>}
        <div>
          <input type="submit" value="Sign up" disabled={disable} />
          <Link to="/login">Have account already?</Link>
        </div>
      </div>
    </form>
  );
};
export default Signup;
