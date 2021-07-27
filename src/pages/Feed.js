import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PostForm from "../components/Post/PostForm";
import PostList from "../components/Post/PostList";
const Feed = () => {
  const id = localStorage.getItem("userId");
  return (
    <div>
        <PostForm />
        <PostList/>
    </div>
  );
};
export default Feed;
