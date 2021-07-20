import { Link, useHistory } from "react-router-dom";
import "./Header.css";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
const Header = () => {
  const history = useHistory();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const photoUrl = localStorage.getItem('photoUrl');
  const displayName = localStorage.getItem('displayName');
  const {logout} = useAuth();
  const logoutHandler = () => {
    logout();
    history.replace("/");
  };
  return (
    <header>
      <nav className="header-nav">
        <ul className="header-nav-list">      
           {isLoggedIn && (
          <li className="header-nav-feed ">
            <Link to="/feed" >Feed</Link>
          </li>
           )}
             {isLoggedIn && (
            <li>
              <Link to="/profile" className="header-nav-profile"><div className="header-div-avatar"><img src={photoUrl} /></div>{displayName}</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler} className="header-nav-button">Logout</button>
            </li>
          )}
          {!isLoggedIn && (
            <li className="header-nav-login">
              <Link to="/login">Login</Link>
            </li>
          )}
          {!isLoggedIn && (
            <li className="header-nav-signup">
              <Link to="/signup">Sign up</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
export default Header;
