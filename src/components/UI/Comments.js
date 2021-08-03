import "./Comments.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import textBubble from "../../assets/images/text-bubble.svg";
const Comments = (props) => {
  const [commentsShow, setCommentsShow] = useState(false);
  const uid = useSelector((state) => state.userInfo.userId);
  const token = useSelector((state) => state.userInfo.token);
  const displayName = useSelector((state) => state.userInfo.displayName);
  const photoUrl = useSelector((state) => state.userInfo.photoUrl);
  const [commentsList, setCommentsList] = useState([]);
  const [textComment, setTextComment] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [nrChars,setNrChars]=useState(0);
  const toggleCommentsHandler = () => {
    setCommentsShow((commentsShow) => !commentsShow);
  };
  useEffect(() => {
    let usersInfo = {};
    let commentInfo = [];
    if (commentsShow && !loaded) {
      fetch(
        `https://react-http-560ff-default-rtdb.firebaseio.com/comments.json`
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            res.json().then((data) => {
              console.log(data);
            });
          }
        })
        .then((data) => {
          for (const postId in data) {
            for (const userId in data[postId]) {
              let comments = [];
              for (const userPost in data[postId][userId]) {
                comments.push(data[postId][userId][userPost].comment);
              }
              commentInfo.push({
                userId,
                comments,
                displayName: "",
                photoUrl: "",
              });
            }
          }
          return fetch(
            `https://react-http-560ff-default-rtdb.firebaseio.com/users.json`
          )
            .then((res) => {
              if (res.ok) {
                return res.json();
              } else {
                res.json().then((data) => {
                  console.log(data);
                });
              }
            })
            .then((data) => {
              for (const userId in data) {
                usersInfo[userId] = {
                  displayName: data[userId].displayName,
                  photoUrl: data[userId].photoUrl,
                };
              }
              let userId = "";
              for (const userIndex in commentInfo) {
                userId = commentInfo[userIndex].userId;
                commentInfo[userIndex].displayName =
                  usersInfo[userId].displayName;
                commentInfo[userIndex].photoUrl = usersInfo[userId].photoUrl;
              }
              setCommentsList(commentInfo);
            });
        });
      setLoaded(true);
    }
  }, [commentsShow]);
  const onKeyUp = (event) => {
    if (event.key === "Enter") {
      let commentData = event.target.value;
      if (commentData.length < 1) {
        return;
      }
      if (commentData.length > 300) {
        setNrChars(commentData.length);
        return;
      }

      //displayName will not be sent to fetch only used localy when comment is created
      fetch(
        `https://react-http-560ff-default-rtdb.firebaseio.com/comments/${props.postId}/${uid}.json?auth=${token}`,
        {
          method: "POST",
          body: JSON.stringify({ comment: commentData }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            console.log(res);
            return res.json();
          } else {
            res.json().then((data) => {
              console.log(data);
            });
          }
        })
        .then((data) => {
          setCommentsList((commentsList) => [
            ...commentsList,
            {
              displayName,
              photoUrl,
              comments: [commentData],
            },
          ]);
          setTextComment("");
        });
    }
  };
  return (
    <div className="comments-section">
      <button
        className="comments-section__button"
        onClick={toggleCommentsHandler}
      >
        <img src={textBubble} />
      </button>
      {commentsShow && (
        <div className="comments-section__container">
          <ul className="comments-section__list">
            {commentsList.map((comment) =>
              comment.comments.map((text) => (
                <li>
                  <div>
                    <div className="comments-section__user-info">
                      <img
                        className="comments-section__avatar"
                        src={comment.photoUrl}
                      />
                      <div>{comment.displayName}</div>
                    </div>
                    <div className="comments-section__comment">{text}</div>
                  </div>
                </li>
              ))
            )}
          </ul>
          <textarea
            onKeyPress={onKeyUp}
            onChange={(e) => {setTextComment(e.target.value);setNrChars(0)}}
            placeholder="Write a comment..."
            value={textComment}
            className="comments-section__container__write"
            rows="4"
            columns="50"
          ></textarea>
          {nrChars>300 && <p className="comments-section__warning">Comment should be less than 300 chars,you have {nrChars}</p>}
        </div>
      )}
    </div>
  );
};
export default Comments;
