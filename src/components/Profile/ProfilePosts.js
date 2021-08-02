import "./ProfilePosts.css";
import PostCard from "../Post/PostCard";
import { useLocation } from "react-router";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "react-loader-spinner";
const ProfilePosts = (props) => {
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const displayName = useSelector((state) => state.userInfo.displayName);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  let likesList = [];
  let likeInfo = [];
  useEffect(() => { 
    setLoading(true);
    fetch(`https://react-http-560ff-default-rtdb.firebaseio.com/liked.json`)
      .then((response) => response.json())
      .then((data) => {
        likeInfo = data;
      });
    if (location.pathname === "/profile") {
      return fetchPosts(userId);    
    } else {
      const currentUserId = props.currentUserId;
      return fetchPosts(currentUserId);   
    }
  }, [fetch, props.displayName, displayName, userId]);
  const fetchPosts = (uid) => {
    let postList = [];
    fetch(
      `https://react-http-560ff-default-rtdb.firebaseio.com/posts/${uid}.json`
    )
      .then((response) => response.json())
      .then((data) => {
        for (const key in data) {
          likesList=[];
          for (const postLikeId in likeInfo) {
            if (postLikeId === key) {
              likesList.push(likeInfo[postLikeId]);
            }
          }
          postList.push({
            id: key,
            text: data[key].text,
            imageURL: data[key].imageURL,
            userId: uid,
            displayName: props.displayName,
            likes: likesList,
          });
        }
        setPosts(postList);
        setLoading(false);
      });
  };
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
  )).reverse();
  return <div className="post-list-container">{!loading ? postList : <Loader 
    type="TailSpin"
    color="#585d99"
    height={100}
    width={100}
  
  />}</div>;
};
export default ProfilePosts;
