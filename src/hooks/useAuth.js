import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

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
          dispatch({type:'IS_ERROR',boolean:false});
          return res.json();
        } else {
          res.json().then((data) => {
            if (data.error.message === "EMAIL_EXISTS"){
              dispatch({type:'IS_ERROR',boolean:true});
            }
            if (data.error.message === "EMAIL_NOT_FOUND"){
              dispatch({type:'IS_ERROR',boolean:true});
            }
            console.log(data.error);
          });
        }
      })
      .then((data) => {
        dispatch({ type: "LOGIN", token: data.idToken });
        localStorage.setItem("token", data.idToken);

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
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    dispatch({ type: "LOGOUT" });
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, [logoutTimer, dispatch]);

  //need to fix warning
  useEffect(() => {
    if (duration) {
        setLogoutTimer(setTimeout(logout, duration))
    }
    return ()=>{};
  }, [setLogoutTimer]);
  return { login, logout };
};
export default useAuth;
