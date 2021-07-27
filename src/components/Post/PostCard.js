import heart from '../../assets/images/heart.svg';
import "./PostCard.css";
const PostCard = (props) => {
  return (
    <div className="post-card">
      <div className="post-card__heading">{props.displayName}</div>
      <div className="post-card__content">
        <div className="post-card__text">
            {props.text}
        </div>       
          {props.imageURL &&  (
           <div className="post-card__image">
              <img src={props.imageURL} />
            </div>
          )}
      </div>
      <div className="post-card__likes"><img src={heart}/></div>
    </div>
  );
};
export default PostCard;
