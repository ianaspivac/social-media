import "./PostList.css";
import PostCard from "./PostCard";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
const PostList = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.userInfo.token);
  const fetchPostsHandler = useCallback(async () => {
    setLoading(true);
    let usersInfo = [];
    let likeInfo = [];
    let likesList = [];

    fetch(
      `https://react-http-560ff-default-rtdb.firebaseio.com/users.json?auth=${token}`
    )
      .then((response) => response.json())
      .then((data) => {
        for (const user in data) {
          usersInfo.push({
            id: user,
            displayName: data[user].displayName,
          });
        }
      });
    fetch(`https://react-http-560ff-default-rtdb.firebaseio.com/liked.json`)
      .then((response) => response.json())
      .then((data) => {
        likeInfo = data;
      });
    try {
      const response = await fetch(
        `https://react-http-560ff-default-rtdb.firebaseio.com/posts.json`
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const loadedPosts = [];
      for (const uid in data) {
        let currentUserId = "";
        for (const user in usersInfo) {
          if (usersInfo[user].id === uid) {
            currentUserId = usersInfo[user];
          }
        }
        for (const key in data[uid]) {
          likesList = [];
          for (const postLikeId in likeInfo) {
            if (postLikeId === key) {
              likesList.push(likeInfo[postLikeId]);
            }
          }
          loadedPosts.push({
            ...data[uid][key],
            id: key,
            userId: uid,
            displayName: currentUserId.displayName,
            likes: likesList,
          });
        }
      }
      setPosts(loadedPosts);
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    fetchPostsHandler();
    setLoading(false);
  }, [fetchPostsHandler,props.toggleNewPost]);
 

  const postList = posts.map((post) => (
    <PostCard
      id={post.id}
      key={post.id}
      text={post.text}
      imageURL={post.imageURL}
      userId={post.userId}
      displayName={post.displayName}
      likes={post.likes}
    />
  )).reverse();
  return <div>{!loading ? <div>{postList}</div> : <p>Loading...</p>}</div>;
};
export default PostList;
