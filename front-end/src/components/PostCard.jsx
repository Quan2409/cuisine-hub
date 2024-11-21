import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiLike, BiSolidLike, BiComment } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import moment from "moment";
import CommentForm from "./CommentForm";

import { postComments } from "../assets/data";

const PostCard = ({ post, user, deletePost, likePost }) => {
  const [showAll, setShowAll] = useState(0);
  const [showreply, setShowReply] = useState(0);
  const [comment, setComments] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [replyComments, setReplyComment] = useState(0);
  const [showComments, setShowComments] = useState(0);

  const getComments = async () => {
    setReplyComment(0);
    setComments(postComments);
    setIsLoad(false);
  };

  return (
    <div className="mb-2 bg-primaryColor p-4 rounded-xl">
      <div className="flex gap-3 items-center mb-2">
        <Link to={"/profile/" + post.userId._id}>
          <img
            src={post.userId.profileUrl ?? "/user.png"}
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
            {moment(post.createdAt ?? "2023-05-25").fromNow()}
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
        <div className="flex gap-2 items-center text-base cursor-pointer">
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
            getComments(post._id);
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
          <CommentForm
            user={user}
            id={post._id}
            getComments={() => getComments(post._id)}
          />

          {isLoad ? (
            <Loading />
          ) : comment.length > 0 ? (
            postComments.map((comment) => (
              <div key={comment._id} className="w-full py-2">
                <div className="flex gap-3 items-center mb-1">
                  <Link to={"/profile/" + comment.userId._id}>
                    <img
                      src={comment.userId.profileUrl ?? "/user.png"}
                      alt={comment.userId.firstName}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  </Link>
                  <div>
                    <Link to={"/profile/" + comment.userId._id}>
                      <p className="fotn-medium text-base text-ascent-1">
                        {comment.userId.firstName} {comment.userId.lastName}
                      </p>
                    </Link>
                    <span className="text-ascent-2 text-sm">
                      {moment(comment.createdAt).fromNow()}
                    </span>
                  </div>
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
