const CommentCard = ({
  comment,
  user,
  setComments,
  setReplyComment,
  replyComments,
  showReply,
  setShowReply,
}) => {
  return (
    <div className="ml-16">
      <p className="text-ascent-2">{comment.comment}</p>
      <div className="mt-2 flex gap-6">
        <div
          className="flex gap-2 items-center text-base text-ascent-2 cursor pointer"
          onClick={() => likeComment(comment._id)}
        >
          {comment.likes.includes(user._id) ? (
            <BiSolidLike size={20} color="yellow" />
          ) : (
            <BiLike size={20} />
          )}
          {comment.likes.length} Likes
        </div>
        <span
          className="text-yellow cursor-pointer"
          onClick={() =>
            setReplyComment((prev) => (prev === comment._id ? 0 : comment._id))
          }
        >
          Reply
        </span>
      </div>

      {replyComments === comment._id && (
        <CommentForm
          user={user}
          id={comment._id}
          replyAt={comment.from}
          comment={comment}
          setComments={setComments}
          setReplyComment={setReplyComment}
        />
      )}

      <div className="py-2 px-8 mt-3 ml-8">
        {comment.replies.length > 0 && (
          <div
            className="text-base text-ascent-1 cursor-pointer"
            onClick={() =>
              setShowReply(showReply === comment._id ? 0 : comment._id)
            }
          >
            {showReply === comment._id
              ? `Hide Replies`
              : `Show Replies (${comment.replies.length})`}
          </div>
        )}

        {showReply === comment._id &&
          comment.replies.map((reply) => (
            <ReplyCard
              key={reply._id}
              reply={reply}
              user={user}
              comment={comment}
              setComments={setComments}
            />
          ))}
      </div>
    </div>
  );
};

export default CommentCard;
