import { useState, useReducer, useEffect } from "react";
import { useSelector } from "react-redux";
import firebase from "../../Firebase/Firebase";
import "./PostForm.css";
//import { profanity } from '@2toad/profanity';
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
const PostForm = (props) => {
  let timer = null;
  const idToken = useSelector((state) => state.userInfo.token);
  const userId = useSelector((state) => state.userInfo.userId);
  const photoUrl = useSelector((state) => state.userInfo.photoUrl);
  const displayName = useSelector((state) => state.userInfo.displayName);
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);
  const [nrChars, setNrChars] = useState(0);
  const [sentMessage, setSentMessage] = useState(false);
  const [data, dispatch] = useReducer(reducer, {
    text: "",
    dropDepth: 0,
    inDropZone: false,
    file: {},
  });
  const { file } = data;
  const { text } = data;
  const deleteImageHandler = () => {
    dispatch({ type: "DELETE_FILE" });
  };
  useEffect(() => {
    if (photoUrl === undefined || displayName === undefined) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [photoUrl, displayName]);
  const postHandler = (event) => {
    setNrChars(0);
    event.preventDefault();
    setSent(false);
    if (text.length < 1) {
      return;
    }
    if (text.length > 300) {
      setNrChars(text.length);
      return;
    }
    //if(profanity.exists(text)){
    //  console.log("bad");
    //  return;
   // }
    if (file.name) {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef
        .child(`postsImage/${userId}/${file.name}`)
        .put(file);
      console.log(file);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {},
        (error) => {
          throw error;
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            fetchPost(text, url);
          });
        }
      );
    } else {
      fetchPost(text, "");
    }
  };
  const fetchPost = (text, imageURL) => {
    fetch(
      `https://react-http-560ff-default-rtdb.firebaseio.com/posts/${userId}.json?auth=${idToken}`,
      {
        method: "POST",
        body: JSON.stringify({ text, imageURL }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          setSent(true);
          setSentMessage(true);

          timer = setTimeout(() => {
            setSentMessage(false);
          }, 3000);
          dispatch({ type: "DELETE_FILE" });
          return res.json();
        } else {
          res.json().then((data) => {
            console.log(data);
          });
        }
      })
      .then((data) => {
        props.sendPost();
      });
    return () => clearTimeout(timer);
  };
  return (
    <div className="post-form__container">
      {!loading ? (
        <div className="post-form__heading">
          <div className="post-form__avatar">
            <img src={photoUrl} alt="profile pic" />
          </div>
          <div className="post-form__name">{displayName}</div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <form className="post-form__form" onSubmit={postHandler}>
        {sentMessage && <div className="post-form__message">Posted!</div>}
        <PostInput data={data} dispatch={dispatch} sent={sent} />
        {file.name && (
          <div className="post-form__dropped-file">
            <button
              className="post-form__dropped-file__undo"
              onClick={deleteImageHandler}
            >
              x
            </button>
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
