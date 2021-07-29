import {Link} from "react-router-dom";
import heart from "../../assets/images/heart.svg";
import "./PostCard.css";
const PostCard = (props) => {
  const token = localStorage.getItem("token");
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
        <img src={heart} />
      </div>
    </div>
  );
};
export default PostCard;
