import React, { useState } from "react";
import { useSelector } from "react-redux";
import TopBar from "../components/TopBar";
import ProfileCard from "../components/ProfileCard";
import FriendCard from "../components/FriendCard";
import { friends, requests } from "../assets/data";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const [friendsRequest, setFriendRequest] = useState(requests);
  const [suggestFriends, setSuggestFriend] = useState(friends);

  return (
    <div className="home w-full px-0 lg:px-10 pb-20 xxl:px-40 bg-backgroundColor kg:rounded-lg h-screen overflow-hidden">
      <TopBar />
      <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
        {/* left-side */}
        <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          <ProfileCard user={user} />
          <FriendCard friends={user.friends} />
        </div>

        {/* center-side */}
        <div className="flex-1 h-full bg-primaryColor px-4 flex flex-col gap-6 overflow-auto">
          {/*  */}
        </div>

        {/* right-side */}
        <div className="hiddent w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
          <div className="w-full bg-primaryColor shadow-sm rounded-lg px-6 py-5">
            <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
              <span>Friend Request</span>
              <span>{friendsRequest.length}</span>
            </div>

            <div className="w-full flex flex-col gap-4 pt-4">
              {friendsRequest.map(({ _id, requestFrom }) => (
                <div key={_id} className="flex items-center justify-between">
                  <Link
                    to={"/profile/" + requestFrom._id}
                    className="w-full flex gap-4 items-center cursor-pointer"
                  >
                    <img
                      src={requestFrom.profileUrl ?? "/user.png"}
                      alt={requestFrom.firstName}
                      className="w-14 h-14 object-cover rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-base font-medium text-ascent-1">
                        {requestFrom.firstName} {requestFrom.lastName}
                      </p>
                      <span className="text-sm text-ascent-2">
                        {requestFrom.profession ?? "No Professtion"}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
