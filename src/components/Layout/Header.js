import { Link, useHistory } from "react-router-dom";
import "./Header.css";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
const Header = () => {
  const history = useHistory();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const {logout} = useAuth();
  const logoutHandler = () => {
    logout();
    history.replace("/");
  };
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/feed">Feed</Link>
          </li>
          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <Link to="/signup">Sign up</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
export default Header;
