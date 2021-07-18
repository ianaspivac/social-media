import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import avatar from '../assets/images/user.png';

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};
const retrieveStoredToken = () => {
  const storedExpirationDate = localStorage.getItem("expirationTime");
  const remainingTime = calculateRemainingTime(storedExpirationDate);
  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }
  return remainingTime;
};
const fetchProfileInfo = (token) => {
  fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBSIZSdghkjvJ_8hJt-FAicfpHNpUAVsPI`,
    {
      method: "POST",
      body: JSON.stringify({
        idToken: token,
      }),
      headers: { "Content-Type": "application/json" },
    }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        res.json().then((data) => {});
      }
    })
    .then((data) => {
      console.log(data);
      localStorage.setItem("email", data.users[0].email);
      if(!data.users[0].displayName){
        localStorage.setItem("displayName", data.users[0].email);
      }
      else{
        localStorage.setItem("displayName", data.users[0].displayName); 
      }
      if(!data.users[0].photoUrl){
        localStorage.setItem("photoUrl", avatar);
      }
      else{
        localStorage.setItem("photoUrl", data.users[0].photoUrl);
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
const useAuth = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const duration = retrieveStoredToken();
  const [logoutTimer, setLogoutTimer] = useState(
    localStorage.getItem("expirationTime")
  );

  const login = (url, enteredEmail, enteredPassword) => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          dispatch({ type: "IS_ERROR", boolean: false });
          return res.json();
        } else {
          res.json().then((data) => {
            if (data.error.message === "EMAIL_EXISTS") {
              dispatch({ type: "EMAIL_EXISTS", boolean: true });
            }
            if (data.error.message === "EMAIL_NOT_FOUND") {
              dispatch({ type: "EMAIL_NOT_FOUND", boolean: true });
            }
            if (data.error.message === "INVALID_PASSWORD") {
              dispatch({ type: "INVALID_PASSWORD", boolean: true });
            }
            console.log(data.error);
          });
        }
      })
      .then((data) => {
        fetchProfileInfo(data.idToken);
        dispatch({
          type: "LOGIN",
          payload: {
            token: data.idToken,
            userId: data.localId,
            email: localStorage.getItem("email"),
            photoUrl: localStorage.getItem("photoUrl"),
            displayName: localStorage.getItem("displayName"),
          },
        });
        localStorage.setItem("token", data.idToken);
        localStorage.setItem("userId", data.localId);
        
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        localStorage.setItem("expirationTime", expirationTime.toISOString());
        const remainingTime = calculateRemainingTime(expirationTime);

        setLogoutTimer(setTimeout(logout, remainingTime));

        history.replace("/feed");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const logout = useCallback(() => {
    localStorage.clear();
    dispatch({ type: "LOGOUT" });
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, [logoutTimer, dispatch]);

  //need to fix warning
  useEffect(() => {
    if (duration) {
      setLogoutTimer(setTimeout(logout, duration));
    }
    return () => {};
  }, [setLogoutTimer]);
  return { login, logout };
};
export default useAuth;
