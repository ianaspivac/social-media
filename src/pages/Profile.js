import ProfileInfo from "../components/Profile/ProfileInfo";
import ProfilePosts from "../components/Profile/ProfilePosts";
import { useLocation, useHistory } from "react-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import avatar from "../assets/images/user.png";
const Profile = () => {
  const history = useHistory();
  const [photoUrl, setPhotoUrl] = useState(
    useSelector((state) => state.userInfo.photoUrl)
  );
  const [displayName, setDisplayName] = useState(
    useSelector((state) => state.userInfo.displayName)
  );
  const [email, setEmail] = useState(
    useSelector((state) => state.userInfo.email)
  );
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token");
  const currentUserId = location.pathname.slice(6, location.pathname.length);

  useEffect(() => {
    if (location.pathname !== "/profile") {
      console.log(location.pathname);
      setLoading(true);
      fetch(
        `https://react-http-560ff-default-rtdb.firebaseio.com/users/${currentUserId}.json?auth=${token}`
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
          setDisplayName(data.displayName);
          setEmail(data.email);
          if (data.photoUrl === "") {
            setPhotoUrl(avatar);
          } else {
            setPhotoUrl(data.photoUrl);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      setLoading(true);
      setDisplayName(localStorage.getItem("displayName"));
      setEmail(localStorage.getItem("email"));
      setPhotoUrl(localStorage.getItem("photoUrl"));
      setLoading(false);
    }
    
  }, [location, currentUserId, token]);

  return (
    <div>
      {!loading ? (
        <ProfileInfo
          displayName={displayName}
          email={email}
          photoUrl={photoUrl}
        />
      ) : (
        <p>Loading</p>
      )}

      {!loading ? (
        <div>
          {location.pathname === "/profile" ? (
            <ProfilePosts displayName={displayName} ownProfile={true} />
          ) : (
            <ProfilePosts
              currentUserId={currentUserId}
              displayName={displayName}
              ownProfile={false}
            />
          )}
        </div>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};
export default Profile;
