import { useRef, useState, useReducer, useEffect } from "react";
import { useSelector } from "react-redux";
import firebase from "../../Firebase/Firebase";
import "./PostForm.css";
import PostInput from "../UI/PostInput";
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TEXT":
      return { ...state, text: action.text };
    case "SET_DROP_DEPTH":
      return { ...state, dropDepth: action.dropDepth };
    case "SET_IN_DROP_ZONE":
      return { ...state, inDropZone: action.inDropZone };
    case "ADD_FILE":
      return { ...state, file: action.fileUpload };
    case "DELETE_FILE":
      return {
        ...state,
        file: {},
      };
    default:
      return state;
  }
};
const PostForm = () => {
  const idToken = useSelector((state) => state.userInfo.token);
  const userId = useSelector((state) => state.userInfo.userId);
  const [photoUrl, setPhotoUrl] = useState(
    useSelector((state) => state.userInfo.photoUrl)
  );
  const [displayName, setDisplayName] = useState(
    useSelector((state) => state.userInfo.displayName)
  );
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);
  const [nrChars, setNrChars] = useState(0);
  const [data, dispatch] = useReducer(reducer, {
    text: "",
    dropDepth: 0,
    inDropZone: false,
    file: {},
  });
  const { file } = data;
  const { text } = data;
  const deleteImageHandler=()=>{
    dispatch({ type: "DELETE_FILE" });
  };
  const postHandler = (event) => {
    setNrChars(0);
    event.preventDefault();
    setSent(false);
    let imageURL = "";
    if (text.length < 1) {
      return;
    }
    if (text.length > 300) {
      setNrChars(text.length);
      return;
    }

    var storage = firebase.storage();
    var storageRef = storage.ref();
    var uploadTask = storageRef
      .child(`postsImage/${userId}/${file.name}`)
      .put(file);

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {},
      (error) => {
        throw error;
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          imageURL = url;
          fetch(
            `https://react-http-560ff-default-rtdb.firebaseio.com/posts/${userId}.json?auth=${idToken}`,
            {
              method: "POST",
              body: JSON.stringify({ text, imageURL }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          ).then((res) => {
            if (res.ok) {
              setSent(true);
              dispatch({ type: "DELETE_FILE" });
              return res.json();
            } else {
              res.json().then((data) => {
                console.log(data);
              });
            }
          });
        });
      }
    );
  };
  useEffect(() => {}, []);
  return (
    <div className="post-form__container">
      <div className="post-form__heading">
        <div className="post-form__avatar">
          <img src={photoUrl} alt="profile pic" />
        </div>
        <div className="post-form__name">{displayName}</div>
      </div>
      <form className="post-form__form" onSubmit={postHandler}>
        <PostInput data={data} dispatch={dispatch} sent={sent} />
        {file.name  && (
          <div className="post-form__dropped-file">
            <button className="post-form__dropped-file__undo" onClick={deleteImageHandler} >x</button>
              <img src={URL.createObjectURL(file)} alt={file.name} />
          </div>
        )}
        {nrChars > 300 && (
          <p>Only 300 characters allowed, you have {nrChars}</p>
        )}
        <input type="submit" className="post-form__submit" value="Post" />
      </form>
    </div>
  );
};
export default PostForm;
//
