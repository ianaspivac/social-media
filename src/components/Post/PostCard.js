import { Link } from "react-router-dom";
import heart from "../../assets/images/heart.svg";
import "./PostCard.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
const PostCard = (props) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [isLiked, setIsLiked] = useState(false);
  const [likesQuantity, setLikesQuantity] = useState(
    Object.keys(props.likes).length
  );
  const [userLikeId, setUserLikeId] = useState("");
  const deletePostHandler = () => {
    fetch(
      `https://react-http-560ff-default-rtdb.firebaseio.com/posts/${props.userId}/${props.id}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        res.json().then((data) => {
          console.log(data);
        });
      }
    });
  };
  const likeHandler = () => {
    if (isLiked) {
      setIsLiked(false);
      fetch(
        `https://react-http-560ff-default-rtdb.firebaseio.com/liked/${props.id}/${userLikeId}/.json`,
        { method: "DELETE" }
      )
        .then((response) => response.json())
        .then((data) => {
          setUserLikeId("");
          setLikesQuantity((likesQuantity) => likesQuantity - 1);
        });
    } else {
      setIsLiked(true);
      fetch(
        `https://react-http-560ff-default-rtdb.firebaseio.com/liked/${props.id}.json`,
        {
          method: "POST",
          body: JSON.stringify(localStorage.getItem("userId")),
          headers: { "Content-Type": "application/json" },
        }
      ).then((res) => {
        if (res.ok) {
          console.log(res);
          setLikesQuantity((likesQuantity) => likesQuantity + 1);
          return res.json();
        } else {
          res.json().then((data) => {
            console.log(data);
          });
        }
      });
    }
  };
  useEffect(() => {
    for (const user in props.likes) {
      for (const likeId in props.likes[user]) {
        if (props.likes[user][likeId] === userId) {
          setUserLikeId(likeId);
          setIsLiked(true);
          break;
        }
      }
    }
  }, []);
  return (
    <div className="post-card">
      <div className="post-card__heading">
        <Link to={`/user/${props.userId}`}>{props.displayName}</Link>
        <div>
          {props.ownProfile && (
            <button
              className="post-card__heading__delete"
              onClick={deletePostHandler}
            >
              x
            </button>
          )}
        </div>
      </div>
      <div className="post-card__content">
        <div className="post-card__text">{props.text}</div>
        {props.imageURL && (
          <div className="post-card__image">
            <img src={props.imageURL} />
          </div>
        )}
      </div>
      <div className="post-card__likes">
        <button onClick={likeHandler}>
          <img src={heart} className={isLiked ? "liked" : ""} />
        </button>
        {props.likes && likesQuantity}
      </div>
    </div>
  );
};
export default PostCard;
