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
    case "ADD_FILE_TO_LIST":
      return { ...state, fileList: state.fileList.concat(action.files) };
    default:
      return state;
  }
};
const PostForm = () => {
  const imageArray = [];
  const imageObj = {};
  const idToken = useSelector((state) => state.userInfo.token);
  const userId = useSelector((state) => state.userInfo.userId);
  const [photoUrl, setPhotoUrl] = useState(
    useSelector((state) => state.userInfo.photoUrl)
  );
  const [displayName, setDisplayName] = useState(
    useSelector((state) => state.userInfo.displayName)
  );
  const [isLoading, setIsLoading] = useState(true);

  const [data, dispatch] = useReducer(reducer, {
    text: "",
    dropDepth: 0,
    inDropZone: false,
    fileList: [],
  });
  const postHandler = (event) => {
    event.preventDefault();

    const { fileList } = data;
    const { text } = data;
    for (const file in fileList) {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef
        .child(`postsImage/${userId}/${fileList[file].name}`)
        .put(fileList[file]);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {},
        (error) => {
          throw error;
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            imageArray.push(url);
            imageObj[file] = imageArray[file];
            console.log(imageObj);
          });
        }
      );
    }
    fetch(
      `https://react-http-560ff-default-rtdb.firebaseio.com/posts/${userId}.json?auth=${idToken}`,
      {
        method: "POST",
        body: JSON.stringify({ text, imageObj }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        res.json().then((data) => {
          console.log(data);
        });
      }
    });
  };
  //TODO:image bigger on click
  return (
    <div className="post-form__container">
      <div className="post-form__heading">
        <div className="post-form__avatar">
          <img src={photoUrl} alt="profile pic" />
        </div>
        <div className="post-form__name">{displayName}</div>
      </div>
      <form className="post-form__form" onSubmit={postHandler} >
        <PostInput data={data} dispatch={dispatch} />
        <ul className="post-form__dropped-files">
        {data.fileList.map((file) => {
          return (
            <li key={file.name}><img src={URL.createObjectURL(file)} alt={file.name} />              
            </li>
          );
        })}
      </ul>
        <input type="submit" className="post-form__submit" value="Post" />
      </form>
      
    </div>
  );
};
export default PostForm;
