import { Link } from "react-router-dom";

import { sendRequest } from "../service/service.js";
import Button from "./Button";

const FriendCard = ({ user, friends }) => {
  const handleUnFriend = async (friendId) => {
    try {
      const confirm = window.confirm(
        "Are you sure want to unfriend this person ?"
      );
      if (confirm) {
        const response = await sendRequest({
          url: `user/un-friend`,
          method: "POST",
          data: { friendId }, // Gửi friendId dưới dạng body
          token: user.token,
        });
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full bg-primaryColor shadow-sm rounded-lg px-6 py-5">
      <div className="flex item-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
        <span>Friends</span>
        <span>{friends?.length}</span>
      </div>

      <div className="w-full flex flex-col gap-4 pt-4">
        {friends?.map((friend) => (
          <div key={friend._id} className="flex items-center justify-between">
            <Link
              to={"/profile/" + friend._id}
              key={friend._id}
              className="w-full flex gap-4 items-center cursor-pointer"
            >
              <img
                src={friend.avatar ?? "/user.png"}
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
            <div className="flex gap-1">
              <Button
                title="Unfriend"
                containerStyle="w-[60px] bg-[#fff242] text-xs text-black px-2 py-2 rounded-full"
                onClick={() => handleUnFriend(friend._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendCard;
