import React from "react";
import { Link } from "react-router-dom";

const FriendCard = ({ friends }) => {
  return (
    <div className="w-full bg-primaryColor shadow-sm rounded-lg px-6 py-5">
      <div className="flex item-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
        <span>Friends</span>
        <span>{friends.length}</span>
      </div>

      <div className="w-full flex flex-col gap-4 pt-4">
        {friends.map((friend) => (
          <Link
            to={"/profile/" + friend._id}
            key={friend._id}
            className="w-full flex gap-4 items-center cursor-pointer"
          >
            <img
              src={friend.profileUrl ?? "/user.png"}
              alt={friend.firstName}
              className="w-14 h-14 object-cover rounded-full"
            />
            <div className="flex-1">
              <p className="text-base font-medium text-ascent-1">
                {friend.firstName} {friend.lastName}
              </p>
              <span className="text-sm text-ascent-2">
                {friend.profession ?? "No Professtion"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FriendCard;
