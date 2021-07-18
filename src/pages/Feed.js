import { useSelector } from "react-redux";
import PostForm from "../components/Post/PostForm";
const Feed = () => {
  const id = localStorage.getItem("userId");
  //added temporary post form
  return (
    <div>
     <PostForm/>
    </div>
  );
};
export default Feed;
