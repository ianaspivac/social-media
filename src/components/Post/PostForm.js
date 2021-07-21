import { useRef, useState, useReducer, useEffect } from "react";
import { useSelector } from "react-redux";
import "./PostForm.css";
import DragAndDrop from "../UI/DragAndDrop";
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DROP_DEPTH":
      return { ...state, dropDepth: action.dropDepth };
    case "SET_IN_DROP_ZONE":
      return { ...state, inDropZone: action.inDropZone };
    case "ADD_FILE_TO_LIST":
      return { ...state, fileList: state.fileList.concat(action.filesData) };
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
  const [isLoading, setIsLoading] = useState(true);
  const textInputRef = useRef();

  const [data, dispatch] = useReducer(reducer, {
    dropDepth: 0,
    inDropZone: false,
    fileList: [],
  });
  const postHandler = (event) => {
    event.preventDefault();
    const enteredText = textInputRef.current.value;
    const { fileList } = data;
    const filesSrc = fileList.map((file) => file.fileSrc);
    fetch(
      `https://react-http-560ff-default-rtdb.firebaseio.com/posts/${userId}.json?auth=${idToken}`,
      {
        method: "POST",
        body: JSON.stringify({ enteredText, filesSrc }),
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
  return (
    <div>
      <div>
        <div>
          <img src={photoUrl} alt="profile pic" />
        </div>
        <div>{displayName}</div>
      </div>

      <form onSubmit={postHandler}>
        <textarea ref={textInputRef} rows="4" cols="50" />
        <DragAndDrop data={data} dispatch={dispatch} />
        <input type="submit" value="Post" />
      </form>
      <ul className="dropped-files">
        {data.fileList.map((file) => {
          return (
            <li key={file.files[0].name}>
              <img src={file.fileSrc} alt={file.files[0].name} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default PostForm;
