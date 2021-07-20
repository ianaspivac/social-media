import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PostForm from "../components/Post/PostForm";
const Feed = () => {
  const id = localStorage.getItem("userId");
  return (
    <div>
        <PostForm />
    </div>
  );
};
export default Feed;
