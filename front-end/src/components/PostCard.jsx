import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiLike, BiSolidLike, BiComment } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import moment from "moment";

import CommentForm from "./CommentForm";
import ReplyCard from "./ReplyCard";

import { sendRequest } from "../service/service";

const PostCard = ({ post, user, deletePost, likePost }) => {
  const [showAll, setShowAll] = useState(0);
  const [showReply, setShowReply] = useState(0);
  const [showComments, setShowComments] = useState(0);
  const [comment, setComments] = useState([]);
  const [replyComments, setReplyComment] = useState(0);
  const [isLoad, setIsLoad] = useState(false);

  const getPostComment = async (id) => {
    try {
      const response = await sendRequest({
        url: `/post/get-comment/${id}`,
      });
      setReplyComment(0);
      setComments(response.data || []);
      setIsLoad(false);
    } catch (error) {
      console.log(error);
    }
  };

  const likeComment = async (id) => {
    try {
      const response = await sendRequest({
        url: `post/like-comment/${id}`,
        method: "POST",
        token: user.token,
      });
      setComments((prevComments) =>
        prevComments.map((cmt) =>
          cmt._id === id
            ? {
                ...cmt,
                likes: response.data.likes,
              }
            : cmt
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-2 bg-primaryColor p-4 rounded-xl">
      <div className="flex gap-3 items-center mb-2">
        <Link to={"/profile/" + post.userId._id}>
          <img
            src={post.userId.avatar ?? "/user.png"}
            alt={post.userId.firstName}
            className="w-14 h-14 object-cover rounded-full"
          />
        </Link>

        <div className="w-full flex justify-between">
          <div className="">
            <Link to={"/profile/" + post.userId._id}>
              <p className="font-medium text-lg text-ascent-1">
                {post.userId.firstName} {post.userId.lastName}
              </p>
            </Link>
            <span className="text-ascent-2">{post.userId.location}</span>
          </div>
          <span className="text-ascent-2">
            {post.createdAt ? moment(post.createdAt).fromNow() : "Invalid date"}
          </span>
        </div>
      </div>

      <div>
        <p className="text-ascent-2">
          {showAll === post._id ? post.content : post.content.slice(0, 300)}
          {post.content.length > 301 &&
            (showAll === post._id ? (
              <span
                className="text-yellow ml-2 font-medium cursor-pointer"
                onClick={() => setShowAll(0)}
              >
                Show Less
              </span>
            ) : (
              <span
                className="text-yellow ml-2 font-medium cursor-pointer"
                onClick={() => setShowAll(post._id)}
              >
                Show More
              </span>
            ))}
        </p>

        {post.image && (
          <img
            src={post.image}
            alt="post-image"
            className="w-full mt-2 rounded-lg"
          />
        )}
      </div>

      <div className="mt-4 flex justify-between items-center px-3 py-2 text-ascent-2 text-base border-t border-[#66666645]">
        <div
          className="flex gap-2 items-center text-base cursor-pointer"
          onClick={() => likePost(post._id)}
        >
          {post.likes.includes(user._id) ? (
            <BiSolidLike size={20} color="yellow" />
          ) : (
            <BiLike size={20} />
          )}
          {post.likes.length} Likes
        </div>

        <div
          className="flex gap-2 items-center text-base cursor-pointer"
          onClick={() => {
            setShowComments(showComments === post._id ? null : post._id);
            getPostComment(post._id);
          }}
        >
          <BiComment size={20} />
          {post.comments.length} Comments
        </div>

        {user._id === post.userId._id && (
          <div
            className="flex gap-1 items-center text-base text-ascent-1 cursor-pointer"
            onClick={() => deletePost(post._id)}
          >
            <MdOutlineDeleteOutline size={20} />
            <span>Delete</span>
          </div>
        )}
      </div>

      {showComments === post._id && (
        <div className="w-full mt-4 border-t border-[#66666645] pt-4">
          <CommentForm user={user} id={post._id} setComments={setComments} />

          {isLoad ? (
            <Loading />
          ) : comment.length > 0 ? (
            comment.map((comment) => (
              <div key={comment._id} className="w-full py-4">
                <div className="flex gap-3 items-center mb-1">
                  <Link to={"/profile/" + comment.userId}>
                    <img
                      src={comment.userId?.avatar ?? "/user.png"}
                      alt={comment.userId?.firstName}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  </Link>
                  <div>
                    <Link to={"/profile/" + comment.userId}>
                      <p className="fotn-medium text-base text-ascent-1">
                        {comment.userId.firstName} {comment.userId.lastName}
                      </p>
                    </Link>
                    <span className="text-ascent-2 text-sm">
                      {moment(comment.createdAt).fromNow()}
                    </span>
                  </div>
                </div>

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
                        setReplyComment((prev) =>
                          prev === comment._id ? 0 : comment._id
                        )
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
                </div>

                <div className="py-2 px-8 mt-3 ml-8">
                  {comment.replies.length > 0 && (
                    <div
                      className="text-base text-ascent-1 cursor-pointer"
                      onClick={() =>
                        setShowReply(
                          showReply === comment._id ? 0 : comment._id
                        )
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
            ))
          ) : (
            <span className="flex text-sm py-4 text-ascent-2 text-center">
              No Comments, be the first one to comment
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
