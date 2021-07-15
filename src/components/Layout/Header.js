import { Link, useHistory } from "react-router-dom";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
const Header = () => {
  const history = useHistory();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
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
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Sign up</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
