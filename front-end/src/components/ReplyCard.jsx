import { Link } from "react-router-dom";
import { BiLike, BiSolidLike } from "react-icons/bi";
import moment from "moment";

import { sendRequest } from "../service/service";

const ReplyCard = ({ comment, setComments, user, reply }) => {
  console.log(comment);

  const likeReply = async (id) => {
    try {
      const response = await sendRequest({
        url: `post/like-comment/${comment._id}/${id}`,
        method: "POST",
        token: user.token,
      });
      setComments((prevComments) =>
        prevComments.map((cmt) =>
          cmt._id === comment._id
            ? {
                ...cmt,
                replies: cmt.replies.map((r) =>
                  r._id === id
                    ? {
                        ...r,
                        likes: response.data.$set["replies.$.likes"],
                      }
                    : r
                ),
              }
            : cmt
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full py-3 ">
      <div className="flex gap-3 items-center mb-1">
        <Link to={"/porfile/" + comment.userId._id}>
          <img
            src={comment.userId.avatar ?? "/user.png"}
            alt={comment.userId.firstName}
            className="w-14 h-14 rounded-full object-cover"
          />
        </Link>

        <div>
          <Link to={"/porfile/" + comment.userId._id}>
            <p className="font-medium text-base text-ascent-1">
              {comment.from}
            </p>
          </Link>
          <span className="text-ascent-2 text-sm">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
      </div>

      <div className="ml-16">
        <p className="text-ascent-2">{reply.comment}</p>
        <div className="mt-2 flex gap-6">
          <div
            className="flex gap-2 items-center text-base text-ascent-2 cursor-pointer"
            onClick={() => likeReply(reply._id)}
          >
            {reply.likes.includes(user._id) ? (
              <BiSolidLike size={20} color="yellow" />
            ) : (
              <BiLike size={20} />
            )}
            {reply.likes.length} Likes
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyCard;
