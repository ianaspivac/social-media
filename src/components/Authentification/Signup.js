import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./AuthForm.css";
import useAuth from "../../hooks/useAuth";
import Filter from 'bad-words';
const Signup = () => {
  const dispatch = useDispatch();
  const { login } = useAuth();
  const isEmailExistent = useSelector((state) => state.isErrorEmailExists);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [matchPass, setMatchPass] = useState();
  const [lengthPass, setLengthPass] = useState();
  const [validEmail, setValidEmail] = useState();
  const [disable, setDisable] = useState(false);
  const [prohibited,setProhibited]=useState(false);

  const validatingForm = () => {
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    setValidEmail(!pattern.test(email));
    setMatchPass(password !== confirmPassword);
    setLengthPass(password.length < 6);
    return matchPass || lengthPass || validEmail;
  };
  useEffect(() => {
    setDisable(validatingForm());
  }, [validatingForm]);

  const signupHandler = (event) => {
    event.preventDefault();
    setProhibited(false);
    var filter = new Filter();
    if (filter.isProfane(email)){
      setProhibited(true);
      return;
    }
    if (!disable) {
      login(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBSIZSdghkjvJ_8hJt-FAicfpHNpUAVsPI",
        email,
        password
      );
    }
  };
  const emailHandler = (event) => {
    dispatch({ type: "EMAIL_EXISTS", boolean: false });
    setEmail(event.target.value);
  };
  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };
  const confirmPasswordHandler = (event) => {
    setConfirmPassword(event.target.value);
  };
  return (
    <form onSubmit={signupHandler} className="authentification-form">
      <div className="authentification-form__name">
        <h1>Sign up</h1>
      </div>
      <div className="authentification-form__inputs">
        <input className={isEmailExistent || validEmail ? 'invalid': ''} type="email" value={email} onChange={emailHandler} required />
        {isEmailExistent && <p className="authentification-form__invalid">Email exists already</p>}
        {validEmail && <p className="authentification-form__invalid">Email is not valid</p>}
        {prohibited && <p className="authentification-form__invalid">Innappropriate language</p>}
        <input className={lengthPass ? 'invalid': ''}
          type="password"
          value={password}
          onChange={passwordHandler}
          required
        />
        {lengthPass && <p className="authentification-form__invalid">Password is shorter than 6 characters</p>}

        <input
        className={matchPass ? 'invalid': ''}
          type="password"
          value={confirmPassword}
          onChange={confirmPasswordHandler}
          required
        />
        {matchPass && <p className="authentification-form__invalid">Passwords do not match</p>}
        <div className="authentification-form__actions">
          <input type="submit" value="Sign up" className="authentification-form__submit" disabled={disable} />
          <Link to="/social-media/login" className="authentification-form__link">Have account already?</Link>
        </div>
      </div>
    </form>
  );
};
export default Signup;
