import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import avatar from "../assets/images/user.png";

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
  const info = useSelector((state) => state.userInfo);
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
            if (data.error.message === "TOO_MANY_ATTEMPTS_TRY_LATER"){
              dispatch({type:"TOO_MANY_ATTEMPTS_TRY_LATER", boolean: true})
            }
            console.log(data.error);
          });
        }
      })
      .then((data) => {
        dispatch({
          type: "LOGIN",
          payload: {
            token: data.idToken,
            userId: data.localId,
            email: data.email,
          },
        });
        localStorage.setItem("token", data.idToken);
        localStorage.setItem("userId", data.localId);
        localStorage.setItem("email", data.email);

        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        localStorage.setItem("expirationTime", expirationTime.toISOString());
        const remainingTime = calculateRemainingTime(expirationTime);

        setLogoutTimer(setTimeout(logout, remainingTime));

        fetchProfileInfo(data.idToken, data.localId, data.email, url);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const fetchProfileInfo = (token, uid, email, url) => {
    if (
      url ===
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBSIZSdghkjvJ_8hJt-FAicfpHNpUAVsPI"
    ) {
      localStorage.setItem(
        "displayName",
        email.substring(0, email.indexOf("@"))
      );
      localStorage.setItem("photoUrl", avatar);
      dispatch({
        type: "SET_USER_INFO",
        payload: {
          displayName: email.substring(0, email.indexOf("@")),
          photoUrl: avatar,
        },
      });
      fetch(
        `https://react-http-560ff-default-rtdb.firebaseio.com/users/${uid}.json?auth=${token}`,
        {
          method: "PUT",
          body: JSON.stringify({
            email: email,
            displayName: email.substring(0, email.indexOf("@")),
            photoUrl: "",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      fetch(
        `https://react-http-560ff-default-rtdb.firebaseio.com/users/${uid}.json?auth=${token}`
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            console.log(res);
            res.json().then((data) => {});
          }
        })
        .then((data) => {
          let photo = "";

          if (data.photoUrl === "") {
            photo = avatar;
          } else {
            photo = data.photoUrl;
          }
          localStorage.setItem("displayName", data.displayName);
          localStorage.setItem("photoUrl", photo);
          dispatch({
            type: "SET_USER_INFO",
            payload: { displayName: data.displayName, photoUrl: photo },
          });
          return history.replace("/feed");
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
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
  }, [setLogoutTimer]);
  return { login, logout };
};
export default useAuth;
