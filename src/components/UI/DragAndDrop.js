import "./DragAndDrop.css";

const DragAndDrop = (props) => {
  const { data, dispatch } = props;
  const handleDragEnter = (event) => {
    event.preventDefault();
    dispatch({ type: "SET_DROP_DEPTH", dropDepth: data.dropDepth + 1 });
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    dispatch({ type: "SET_DROP_DEPTH", dropDepth: data.dropDepth - 1 });
    if (data.dropDepth > 0) return;
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
    let fileSrc = URL.createObjectURL(files[0]);
    if (files && files.length > 0) {
      const existingFiles = data.fileList.map((f) => f.name);
      files = files.filter((f) => !existingFiles.includes(f.name));
      dispatch({ type: "ADD_FILE_TO_LIST", filesData:{files,fileSrc} });
      dispatch({ type: "SET_DROP_DEPTH", dropDepth: 0 });
      dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
    }
  };
  return (
    <div
      className={
        data.inDropZone ? "drag-drop-zone inside-drag-area" : "drag-drop-zone"
      }
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <p>Drag files here to upload</p>
    </div>
  );
};
export default DragAndDrop;
