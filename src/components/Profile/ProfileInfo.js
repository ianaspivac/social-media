import "./ProfileInfo.css";
import { useSelector, useDispatch } from "react-redux";
import edit from '../../assets/images/edit.svg';
const ProfileInfo = () => {
  const displayName = useSelector((state) => state.userInfo.displayName);
  const email = useSelector((state) => state.userInfo.email);
  const photoUrl = useSelector((state) => state.userInfo.photoUrl);
  const nameEditHandler =()=>{};
  return (
    <div className="profile">
      <div className="profile-image-side">
        <div className="profile-image">
          <img src={photoUrl} alt="avatar" />
          <input
            type="file"
            name="avatar"
            accept="image/png, image/jpeg, image/jpg"
          />
        </div>
      </div>
      <div className="profile-info">
        <div className="profile-name">{displayName}</div>
        <button className="profile-edit-name" onClick={nameEditHandler}><img src={edit}/></button>
        <div className="profile-email">{email}</div>
      </div>
    </div>
  );
};
export default ProfileInfo;
