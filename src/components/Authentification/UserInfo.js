import { Link } from "react-router-dom";
import { useRef } from "react";
import useAuth from "../../hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import "./AuthForm.css";
const UserInfo = () => {
  const nameInputRef = useRef();
  const surnameInputRef = useRef();
  const profilepicInputRef = useRef();
  const profileFormHandler = () => {
  };
  return (
    <form onSubmit={profileFormHandler}>
      <div>
        <h1>Profile information</h1>
      </div>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" ref={nameInputRef} required />
        <label htmlFor="surname">Surname</label>
        <input type="text" ref={surnameInputRef} required />
        <label htmlFor="profile-pic">Profile picture</label>
        <input
          type="file"
          name="profile-pic"
          accept="image/png, image/jpeg"
          ref={profilepicInputRef}
        />
        <div>
          <input type="submit" value="Sign in" />
          <Link to="/signup">Finish creating profile</Link>
        </div>
      </div>
    </form>
  );
};
export default UserInfo;
