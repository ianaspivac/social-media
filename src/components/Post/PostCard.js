import { Link } from "react-router-dom";
import heart from "../../assets/images/heart.svg";
import "./PostCard.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Comments from "../UI/Comments";
const PostCard = (props) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [isLiked, setIsLiked] = useState(false);
  const [likesQuantity, setLikesQuantity] = useState(
    Object.keys(props.likes).length
  );
  const [userLikeId, setUserLikeId] = useState("");
  const [displayPost, setDisplayPost] = useState(true);
  const deletePostHandler = () => {
    //in order to avoid fetching multiple times on delete,better to temporary remove
    setDisplayPost(false);
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
  const confirmationHandler = () => {
    var question = window.confirm("Your post will be deleted");
    if (question) {
      deletePostHandler();
    } else {
      return;
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
    displayPost && (
      <div className="post-card">
        <div className="post-card__heading">
          <Link to={`/social-media/user/${props.userId}`}>{props.displayName}</Link>
          <div>
            {props.ownProfile && (
              <button
                className="post-card__heading__delete"
                onClick={confirmationHandler}
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
        <div className="post-card__actions">
        <div className="post-card__likes">
          <button onClick={likeHandler}>
            <img src={heart} className={isLiked ? "liked" : ""} />
          </button>
          <div>{props.likes && likesQuantity}</div>         
        </div>
        <Comments id={props.id}/>
        </div>      
      </div>
    )
  );
};
export default PostCard;
