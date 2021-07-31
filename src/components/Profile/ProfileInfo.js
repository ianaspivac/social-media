import "./ProfileInfo.css";
import edit from "../../assets/images/edit.svg";
import tick from "../../assets/images/tick.svg";
import close from "../../assets/images/close.svg";
import { useState, useRef, useEffect } from "react";
import firebase from "../../Firebase/Firebase";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

const ProfileInfo = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const uploadedFileInput = useRef();

  const [photoUrl, setPhotoUrl] = useState(props.photoUrl);
  const [displayName, setDisplayName] = useState(props.displayName);
  const [email, setEmail] = useState(props.email);
  const [enteredName, setEnteredName] = useState(displayName);
  const [loading, setLoading] = useState(false);
  const [isPhotoEdit, setIsPhotoEdit] = useState(false);
  const [isPhotoAdded, setIsPhotoAdded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEnteredNameValid, setIsEnteredNameValid] = useState(true);

  useEffect(() => {
    setDisplayName(props.displayName);
    setEmail(props.email);
    setPhotoUrl(props.photoUrl);
  }, [props.displayName, props.email, props.photoUrl]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const validateEnteredName = (name) => {
    return name.length < 21 && name.length > 0;
  };
  const nameEditHandler = () => {
    setIsEnteredNameValid(true);
    setIsEditing((isEditing) => !isEditing);
  };
  const photoEditHandler = () => {
    setIsPhotoAdded(false);
    setPhotoUrl(localStorage.getItem("photoUrl"));
    setIsPhotoEdit((isPhotoEdit) => !isPhotoEdit);
  };
  const photoPreviewHandler = (event) => {
    setLoading(true);
    const file = event.target.files[0];
    console.log(file);
    setIsPhotoAdded(true);
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var uploadTask = storageRef
      .child(`avatars/${userId}/${file.name}`)
      .put(file);

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {},
      (error) => {
        throw error;
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          setPhotoUrl(url);
          setLoading(false);
        });
      }
    );
  };
  const nameHandler = (event) => {
    setEnteredName(event.target.value);
  };
  const fetchEditedData = (bodyFetch) => {
    fetch(
      `https://react-http-560ff-default-rtdb.firebaseio.com/users/${userId}.json?auth=${token}`,
      {
        method: "PATCH",
        body: JSON.stringify(bodyFetch),
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
      .then((data) => {dispatch({
        type: "SET_USER_INFO",
        payload: { displayName: localStorage.getItem("displayName"), photoUrl:localStorage.getItem("photoUrl") },
      });})
      .catch((err) => {
        console.log(err.message);
      });
  };

  const nameSaveHandler = () => {
    if (!validateEnteredName(enteredName)) {
      setIsEnteredNameValid(false);
      return;
    } else setIsEnteredNameValid(true);
    localStorage.removeItem("displayName");
    localStorage.setItem("displayName", enteredName);
    fetchEditedData({
      displayName: enteredName,
    });
    nameEditHandler();
    setDisplayName(enteredName);
  };

  const photoSaveHandler = (event) => {
    localStorage.removeItem("photoURL");
    localStorage.setItem("photoUrl", photoUrl);
    fetchEditedData({
      photoUrl,
    });
    
    setIsPhotoEdit(false);
  };

  return (
    <div className="profile">
      <div className="profile-image-side">
        <div className="profile-image">
          {!loading ? <img src={photoUrl} alt="avatar" /> : <p>Loading...</p>}
          {location.pathname === "/profile" && (
            <div className="profile-image-photo-edit">
              {isPhotoEdit ? (
                <input
                  type="file"
                  name="avatar"
                  accept="image/png, image/jpeg, image/jpg"
                  ref={uploadedFileInput}
                  onChange={photoPreviewHandler}
                />
              ) : (
                <button
                  className="profile-chnage-photo-button"
                  onClick={photoEditHandler}
                >
                  Change photo
                </button>
              )}
              {isPhotoEdit && (
                <div className="profile-edit-photo-buttons-div">
                  {isPhotoAdded && (
                    <button
                      className="profile-edit-name-button"
                      onClick={photoSaveHandler}
                    >
                      <img src={tick} />
                    </button>
                  )}
                  <button
                    className="profile-edit-name-button"
                    onClick={photoEditHandler}
                  >
                    <img src={close} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="profile-info">
        <div className="profile-edit-name">
          {isEditing && location.pathname === "/profile" ? (
            <input type="text" value={enteredName} onChange={nameHandler} />
          ) : (
            <div className="profile-name">{displayName}</div>
          )}
          {location.pathname === "/profile" && (
            <div>
              {isEditing ? (
                <div className="profile-edit-name-buttons-div">
                  <button
                    className="profile-edit-name-button"
                    onClick={nameSaveHandler}
                  >
                    <img src={tick} />
                  </button>
                  <button
                    className="profile-edit-name-button"
                    onClick={nameEditHandler}
                  >
                    <img src={close} />
                  </button>
                </div>
              ) : (
                <button
                  className="profile-edit-name-button"
                  onClick={nameEditHandler}
                >
                  <img src={edit} />
                </button>
              )}
            </div>
          )}
        </div>
        {isEditing && !isEnteredNameValid && (
          <p div className="profile-name-error">
            Name has to be shorter than 20 characters and atleast 1 character.
          </p>
        )}
        <div className="profile-email">{email}</div>
      </div>
    </div>
  );
};
export default ProfileInfo;
