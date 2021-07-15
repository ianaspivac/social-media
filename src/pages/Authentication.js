import Login from "../components/Authentification/Login";
import Signup from "../components/Authentification/Signup";
import { useLocation } from "react-router-dom";
const Authentification = () => {
  const location = useLocation();
  return <div>{location.pathname === "/login" ? <Login /> : <Signup />}</div>;
};
export default Authentification;
