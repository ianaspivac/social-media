import PostForm from "../components/Post/PostForm";
import PostList from "../components/Post/PostList";
import { useState } from "react";
const Feed = () => {
  const [toggleNewPost,setToggleNewPost]=useState(false);
  const sendPostHandler = () => {
    setToggleNewPost(toggleNewPost=>!toggleNewPost);
  };
  return (
    <div>
      <PostForm sendPost={sendPostHandler}  />
      <PostList toggleNewPost={toggleNewPost} />
    </div>
  );
};
export default Feed;
