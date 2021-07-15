import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
const useAuth = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const login = (url, enteredEmail,enteredPassword) => {
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
          return res.json();
        } else {
          res.json().then((data) => {
            console.log(data);
            let errorMessage = "Authentication fail";
            alert(errorMessage);
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        dispatch({ type: "LOGIN", token: data.idToken });
        localStorage.setItem("token", data.idToken);
        history.replace("/feed");
      })
      .catch((err) => {
        alert(err.message);
      });
      
  };   
  return {login};
};
export default useAuth;
