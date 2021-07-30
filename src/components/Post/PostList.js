import "./PostList.css";
import PostCard from "./PostCard";
import { useEffect, useState, useCallback } from "react";
const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading,setLoading]=useState(true);
  const token = localStorage.getItem("token");
  const fetchPostsHandler = useCallback(async () => {
    setLoading(true);
    let usersInfo = [];
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
          loadedPosts.push({
            ...data[uid][key],
            id: key,
            userId: uid,
            displayName: currentUserId.displayName,
          });
        }
      }
      setPosts(loadedPosts);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  }, []);
//displayname appears later
  useEffect(() => {
    fetchPostsHandler();
  }, [fetchPostsHandler]);

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
  ));
  return <div>{!loading ? <div>{postList}</div> :<p>Loading...</p>}</div>;
};
export default PostList;
