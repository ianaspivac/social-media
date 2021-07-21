import { useRef } from "react";
import "./PostInput.css";

const PostInput = (props) => {
  const { data, dispatch } = props;
  const textInputRef = useRef();
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

    let files = [...event.dataTransfer.files];
    var imageType = /image.*/;
    if (!files[0].type.match(imageType)) {
      return;
    }
    if (files && files.length > 0) {
      const existingFiles = data.fileList.map((f) => f.name);
      files = files.filter((f) => !existingFiles.includes(f.name));
      dispatch({ type: "ADD_FILE_TO_LIST", files });
      dispatch({ type: "SET_DROP_DEPTH", dropDepth: 0 });
      dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
    }
  };
  const getTextHandler = (event) => {
    const text = textInputRef.current.value;
    dispatch({ type: "ADD_TEXT", text });
  };
  return (
    <textarea
    rows="4" cols="50"
      className={
        data.inDropZone ? "drag-drop-zone inside-drag-area" : "drag-drop-zone"
      }
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      ref={textInputRef}
      onChange={getTextHandler}
    ></textarea>
  );
};
export default PostInput;
