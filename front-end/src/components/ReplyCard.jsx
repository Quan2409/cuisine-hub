import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { BiLike, BiSolidLike, BiComment } from "react-icons/bi";

const ReplyCard = ({ user, reply, handleLike }) => {
  return (
    <div className="w-full py-3 ">
      <div className="flex gap-3 items-center mb-1">
        <Link to={"/porfile/" + reply.userId._id}>
          <img
            src={reply.userId.profileUrl ?? "/user.png"}
            alt={reply.userId.firstName}
            className="w-14 h-14 rounded-full object-cover"
          />
        </Link>

        <div>
          <Link to={"/porfile/" + reply.userId._id}>
            <p className="font-medium text-base text-ascent-1">
              {reply.userId.firstName} {reply.userId.lastName}
            </p>
          </Link>
          <span className="text-ascent-2 text-sm">
            {moment(reply.createdAt).fromNow()}
          </span>
        </div>
      </div>

      <div className="ml-12">
        <p className="text-ascent-2">{reply.comments}</p>
        <div className="mt-2 flex gap-6">
          <div
            className="flex gap-2 items-center text-base text-ascent-2 cursor-pointer"
            onClick={handleLike}
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
