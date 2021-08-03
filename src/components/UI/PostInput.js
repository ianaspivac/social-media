import { useRef, useState, useEffect } from "react";
import "./PostInput.css";

const PostInput = (props) => {
  const { data, dispatch } = props;
  const textInputRef = useRef();
  const [enteredText, setEnteredText] = useState("");
  const handleDragEnter = (event) => {
    event.preventDefault();
    dispatch({ type: "SET_DROP_DEPTH", dropDepth: data.dropDepth + 1 });
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    dispatch({ type: "SET_DROP_DEPTH", dropDepth: data.dropDepth - 1 });
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
  };
  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };
  const handleDrop = (event) => {
    event.preventDefault();

    let file = [...event.dataTransfer.files];
    var imageType = /image.*/;
    if (!file[0].type.match(imageType)) {
      return;
    }
    if (file && file.length > 0) {
      console.log(URL.createObjectURL(file[0]));
      let fileUpload = file[0];

      dispatch({ type: "ADD_FILE", fileUpload });
      dispatch({ type: "SET_DROP_DEPTH", dropDepth: 0 });
      dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
    }
  };
  useEffect(() => {
    if (props.sent) {
      setEnteredText("");
    }
  }, [props.sent]);
  const getTextHandler = (event) => {
    setEnteredText(event.target.value);
    const text = textInputRef.current.value;
    dispatch({ type: "ADD_TEXT", text });
  };
  return (
    <textarea
      rows="4"
      cols="50"
      className={
        data.inDropZone ? "drag-drop-zone inside-drag-area" : "drag-drop-zone"
      }
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      ref={textInputRef}
      onChange={getTextHandler}
      value={enteredText}
      placeholder="Add text,image or gif ..."
    ></textarea>
  );
};
export default PostInput;
