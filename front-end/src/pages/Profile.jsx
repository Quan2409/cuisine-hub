import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import TopBar from "../components/TopBar";
import ProfileCard from "../components/ProfileCard";
import FriendCard from "../components/FriendCard";
import PostCard from "../components/PostCard";
import Loading from "../components/Loading";

import { posts } from "../assets/data";

const Profile = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const { dispatch } = useDispatch();

  const [userInfo, setUserInfo] = useState(user);
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {};
  const handleLikePost = () => {};

  return (
    <>
      <div className="w-full px-0 lg:px-10 pb-20 xxl:px-40 bg-backgroundColor h-screen overflow-hidden">
        <TopBar />

        <div className="flex gap-2 lg:gap-4 pt-5 pb-10 w-full h-full">
          <div className="hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={userInfo} />
            {/* <div className="block lg:hidden">
              <FriendCard friends={userInfo.friends} />
            </div> */}
          </div>

          <div className="flex-1 h-full bg-orimary px-4 flex flex-col gap-6 overflow-y-auto">
            {loading ? (
              <Loading />
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  post={post}
                  key={post?._id}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">No Post Available</p>
              </div>
            )}
          </div>

          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            <FriendCard friends={user.friends} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
