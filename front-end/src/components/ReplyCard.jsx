import { Link } from "react-router-dom";
import { BiLike, BiSolidLike } from "react-icons/bi";
import moment from "moment";

import CommentForm from "./CommentForm";

import { sendRequest } from "../service/service";

const ReplyCard = ({
  comment,
  setComments,
  user,
  reply,
  replyComments,
  setReplyComment,
  level,
}) => {
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
                        likes: response.data.likes,
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
    <div className="w-full py-3" style={{ marginLeft: `${level * 50}px` }}>
      <div className="flex gap-3 items-center mb-1">
        <Link to={"/profile/" + reply.userId}>
          {/* Sửa từ comment.userId sang reply.userId */}
          <img
            src={reply?.userId.avatar}
            alt={reply?.userId?.firstName}
            className="w-14 h-14 rounded-full object-cover"
          />
        </Link>

        <div>
          <Link to={"/profile/" + reply?.userId}>
            {/* Sửa từ comment.userId sang reply.userId */}
            <p className="font-medium text-base text-ascent-1">{reply.from}</p>
          </Link>
          <span className="text-ascent-2 text-sm">
            {moment(reply.createdAt).fromNow()}{" "}
            {/* Sửa từ comment.createdAt sang reply.createdAt */}
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
          <span
            className="text-yellow cursor-pointer"
            onClick={
              () =>
                setReplyComment((prev) => (prev === reply._id ? 0 : reply._id)) // Lưu id của reply đang được trả lời
            }
          >
            Reply
          </span>
        </div>

        {/* Hiển thị form reply nếu reply đang được chọn */}
        {replyComments === reply._id && (
          <CommentForm
            user={user}
            id={reply._id}
            replyAt={reply.comment} // replyAt sẽ là comment mà reply này trả lời
            setComments={setComments}
            setReplyComment={setReplyComment}
          />
        )}
      </div>
    </div>
  );
};

export default ReplyCard;
