import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { BiImageAdd, BiVideoPlus } from "react-icons/bi";
import { BsFiletypeGif } from "react-icons/bs";

import Button from "../components/Button";
import TextInput from "../components/TextInput";
import ProfileCard from "../components/ProfileCard";
import FriendCard from "../components/FriendCard";
import TopBar from "../components/TopBar";
import Loading from "../components/Loading";
import PostCard from "../components/PostCard";
import EditProfile from "../components/EditProfile";

import { posts, suggest, requests } from "../assets/data";

const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  const [friendsRequest, setFriendRequest] = useState(requests);
  const [suggestFriends, setSuggestFriend] = useState(suggest);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const [isPost, setIsPosting] = useState(false);
  const [isLoadPost, setIsLoadPost] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handlePostSubmit = async (data) => {};

  return (
    <>
      <div className="px-0 pb-20 w-full h-screen overflow-hidden bg-backgroundColor lg:px-10 xxl:px-40 ">
        <TopBar />
        <div className="flex gap-2 pt-5 pb-10 w-full h-full lg:gap-4">
          {/* left-side */}
          <div className="hidden w-1/3 h-full lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={user} />
            <FriendCard friends={user.friends} />
          </div>

          {/* center-side */}
          <div className="flex-1 h-full px-4 flex flex-col gap-6 rounded-lg overflow-y-auto overscroll-y-auto">
            <form
              className="bg-primaryColor px-4 rounded-lg"
              onSubmit={handleSubmit(handlePostSubmit)}
            >
              <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
                <img
                  src={user.profileUrl ?? "/user.png"}
                  alt={user.firstName}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <TextInput
                  styles="w-full rounded-full py-5"
                  placeholder="What the recipe for today..."
                  name="content"
                  register={register("content", {
                    required: "Write something about posts",
                  })}
                  error={errors.content ? errors.content.message : ""}
                />
                {errMsg.message && (
                  <span
                    role="alert"
                    className={`text-sm ${
                      errMsg.status === "failed"
                        ? "text-[#f64949fe]"
                        : "text-[#2ba150fe]"
                    } mt-0.5`}
                  ></span>
                )}
              </div>
              <div className="flex items-center justify-between py-4">
                <label
                  htmlFor="img-upload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="img-upload"
                    data-max-size="5120"
                    accept=".jpg, .png, ,jpeg"
                  />
                  <BiImageAdd />
                  <span>Image</span>
                </label>

                <label
                  htmlFor="video-upload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="video-upload"
                    data-max-size="5120"
                    accept=".mp4, .wav"
                  />
                  <BiVideoPlus />
                  <span>Video</span>
                </label>

                <label
                  htmlFor="video-upload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="video-upload"
                    data-max-size="5120"
                    accept=".mp4, .wav"
                  />
                  <BsFiletypeGif />
                  <span>Gif</span>
                </label>

                {isPost ? (
                  <Loading />
                ) : (
                  <Button
                    type="submit"
                    title="Post"
                    containerStyle="bg-[#fff242] text-black py-1 px-6 rounded-full font-semibold text-sm"
                  />
                )}
              </div>
            </form>

            {isLoadPost ? (
              <Loading />
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  user={user}
                  deletePost={() => {}}
                  likePost={() => {}}
                />
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">No Posts Avaiable</p>
              </div>
            )}
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
                    <div className="flex gap-1">
                      <Button
                        title="Accept"
                        containerStyle="w-[60px] bg-[#fff242] text-xs text-black px-2 py-2 rounded-full"
                      />

                      <Button
                        title="Deny"
                        containerStyle="w-[60px] bg-[#666] text-xs text-ascent-1 px-2 py-2 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full bg-primaryColor shadow-sm rounded-lg px-5 py-5">
              <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
                <span>Friend Suggestion</span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-4">
                {suggestFriends.map((friends) => (
                  <div
                    key={friends._id}
                    className="flex item-center justify-between "
                  >
                    <Link
                      to={"/profile/" + friends._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={friends.profileUrl ?? "/user.png"}
                        alt={friends.firstName}
                        className="w-14 h-14 object-cover rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-base font-medium text-ascent-1">
                          {friends.firstName} {friends.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {friends.profession ?? "No Professtion"}
                        </span>
                      </div>
                    </Link>

                    <div className="flex items-center gap-1">
                      <Button
                        title="Add"
                        containerStyle="w-[60px] bg-[#fff242] text-xs text-black px-2 py-2 rounded-full"
                        onClick={() => {}}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
    </>
  );
};

export default Home;
