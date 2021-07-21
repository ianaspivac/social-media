import { Link, useHistory } from "react-router-dom";
import "./Header.css";
import { useSelector } from "react-redux";
import {useState, useEffect} from 'react';
import useAuth from "../../hooks/useAuth";
const Header = () => {
  const history = useHistory();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const [photoUrl,setPhotoUrl] = useState(useSelector((state) => state.userInfo.photoUrl));
  const [displayName,setDisplayName] = useState(useSelector((state) => state.userInfo.displayName));
  const {logout} = useAuth();
  const logoutHandler = () => {
    logout();
    history.replace("/");
  };
 useEffect(()=>{
   if(photoUrl !== localStorage.getItem("photoUrl")){
    console.log(photoUrl);
     console.log("a");
     setPhotoUrl(localStorage.getItem("photoUrl"));
     console.log(photoUrl);
   }
 },[setPhotoUrl]);
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
