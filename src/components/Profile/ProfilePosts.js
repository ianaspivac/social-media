import "./ProfilePosts.css";
import PostCard from "../Post/PostCard";
import { useLocation } from "react-router";
import { useState, useEffect } from "react";
const ProfilePosts = (props) => {
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const displayName = localStorage.getItem("displayName");
  const [posts, setPosts] = useState([]);
  const [loading,setLoading]=useState(false);
  useEffect(() => {
    let postList=[];
    setLoading(true);
    if (location.pathname === "/profile") {
      fetch(
        `https://react-http-560ff-default-rtdb.firebaseio.com/posts/${userId}.json`
      )
        .then((response) => response.json())
        .then((data) => {
          for (const post in data) {
            postList.push({
              id: post,
              text: data[post].text,
              imageURL: data[post].imageURL,
              userId,
             displayName,
              likes: data[post].likes,
            });
          }
          setPosts(postList);
          setLoading(false);
        });
    } else {
      const currentUserId = props.currentUserId;
      fetch(
        `https://react-http-560ff-default-rtdb.firebaseio.com/posts/${currentUserId}.json`
      )
        .then((response) => response.json())
        .then((data) => {
          for (const post in data) {
            postList.push({
              id: post,
              text: data[post].text,
              imageURL: data[post].imageURL,
              userId: currentUserId,
              displayName: props.displayName,
              likes: data[post].likes,
            });
          }
          setPosts(postList);
          setLoading(false);
        });
    }

  }, [fetch,props.displayName,displayName,userId]);
  const postList = posts.map((post) => (
    <PostCard
      id={post.id}
      key={post.id}
      text={post.text}
      imageURL={post.imageURL}
      userId={post.userId}
      displayName={post.displayName}
      likes={post.likes}
      ownProfile={props.ownProfile}
    />
  ));
  return <div>{!loading ? postList : <p>Loading...</p>}</div>;
};
export default ProfilePosts;
