import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { BiImageAdd } from "react-icons/bi";

import Button from "../components/Button";
import TextInput from "../components/TextInput";
import ProfileCard from "../components/ProfileCard";
import FriendCard from "../components/FriendCard";
import TopBar from "../components/TopBar";
import Loading from "../components/Loading";
import PostCard from "../components/PostCard";
import EditProfile from "../components/EditProfile";

import { postSlice } from "../redux/slice/postSlice";
import { userSlice } from "../redux/slice/userSlice";
import { handleUpload, sendRequest } from "../service/service";

const { getPosts } = postSlice.actions;
const { login } = userSlice.actions;

const Home = () => {
  const [friendsRequest, setFriendRequest] = useState([]);
  const [suggestFriends, setSuggestFriend] = useState([]);
  const [haveSentRequest, setHaveSendRequest] = useState([]);

  // friendsRequest.forEach((fr, index) => {
  //   console.log(`Friend Request [${index}]:`, fr.request_receiver);
  // });

  const [errMsg, setErrMsg] = useState("");
  const [fileName, setFilenName] = useState("");
  const [file, setFile] = useState(null);
  const [isPost, setIsPosting] = useState(false);
  const [isLoadPost, setIsLoadPost] = useState(false);
  const { user, edit } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const getPost = async () => {
    try {
      const response = await sendRequest({
        url: "/post",
        token: user.token,
      });
      setIsLoadPost(false);
      dispatch(getPosts(response.data || []));
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = async (data) => {
    setIsPosting(true);

    try {
      const img = file && (await handleUpload(file));
      const newData = img ? { ...data, image: img } : data;
      const response = await sendRequest({
        url: "/post/create-post",
        token: user.token,
        method: "POST",
        data: newData,
      });
      console.log(response);
      if (response.status === false) {
        setErrMsg(response);
      } else {
        reset({
          content: "",
        });
        setFile(null);
        setFilenName("");
        setErrMsg("");
        await getPost();
      }
      setIsPosting(false);
    } catch (error) {
      console.log(error);
      setIsPosting(false);
    }
  };

  const likePost = async (id) => {
    try {
      const response = await sendRequest({
        url: `/post/like/${id}`,
        method: "POST",
        token: user.token,
      });
      await getPost();
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (id) => {
    const confirm = window.confirm("Are you sure want to delete this post ?");
    if (confirm) {
      try {
        const response = await sendRequest({
          url: `/post/${id}`,
          method: "DELETE",
          token: user.token,
        });
        await getPost();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getFriendRequest = async () => {
    try {
      const response = await sendRequest({
        url: "/user/get-friend-request",
        token: user.token,
      });
      setFriendRequest(response.requests);
    } catch (error) {
      console.log(error);
    }
  };

  const getSuggestFriends = async () => {
    try {
      const response = await sendRequest({
        url: "/user/suggested-friends",
        token: user.token,
      });
      if (response.friends.length > 0) {
        setSuggestFriend(response.friends);
      } else {
        setSuggestFriend([]);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.info("No suggested friends found.");
      } else {
        console.error("Error fetching suggested friends:", error);
      }
      setSuggestFriend([]);
    }
  };

  const sendFriendRequest = async (id) => {
    try {
      const response = await sendRequest({
        url: "/user/friend-request",
        token: user.token,
        method: "POST",
        data: { request_receiver: id },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptFriendRequest = async (id, status) => {
    try {
      const response = await sendRequest({
        url: "/user/accept-request",
        token: user.token,
        method: "POST",
        data: { request_id: id, request_status: status },
      });
      console.log(response);

      setFriendRequest((prevState) => {
        if (status === "Accepted") {
          setFriendRequest((prevState) =>
            prevState.map((request) =>
              request.id === id ? { ...request, status: "Accepted" } : request
            )
          );
          return prevState.map((request) =>
            request.id === id ? { ...request, status: "Accepted" } : request
          );
        } else if (status === "Denied") {
          setFriendRequest((prevState) =>
            prevState.map((request) =>
              request.id === id ? { ...request, status: "Denied" } : request
            )
          );
          return prevState.map((request) =>
            request.id !== id ? { ...request, status: "Denied" } : request
          );
        }
        return prevState;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const response = await sendRequest({
        url: "/user/get-user",
        token: user.token,
      });
      const newData = { token: user.token, ...response.user };
      dispatch(login(newData));
      return response.user;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoadPost(true);
    getPost();
    getUser();
    getFriendRequest();
    getSuggestFriends();
  }, []);

  return (
    <>
      <div className="px-0 pb-20 w-full h-screen overflow-hidden bg-backgroundColor lg:px-10 xxl:px-40 ">
        <TopBar getAllPosts={getPosts} />
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
              onSubmit={handleSubmit(createPost)}
            >
              <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
                <img
                  src={user.avatar ?? "/user.png"}
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
                    onChange={(e) => {
                      const file = e.target.files[0];
                      console.log(file);
                      if (file) {
                        setFile(file);
                        setFilenName(file.name);
                      }
                    }}
                    className="hidden"
                    id="img-upload"
                    data-max-size="5120"
                    accept=".jpg, .png, .jpeg"
                  />
                  <BiImageAdd />
                  <span>Image</span>

                  <div>
                    {fileName && (
                      <img
                        src={URL.createObjectURL(file)}
                        width={50}
                        height={20}
                        alt={fileName}
                      />
                    )}
                  </div>
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
                  getPost={getPost}
                  deletePost={deletePost}
                  likePost={likePost}
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
                {friendsRequest.map(({ _id, request_from }) => (
                  <div key={_id} className="flex items-center justify-between">
                    <Link
                      to={"/profile/" + request_from._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={request_from.avatar ?? "/user.png"}
                        alt={request_from.firstName}
                        className="w-14 h-14 object-cover rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-base font-medium text-ascent-1">
                          {request_from.firstName} {request_from.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {request_from.profession ?? "No Professtion"}
                        </span>
                      </div>
                    </Link>
                    <div className="flex gap-1">
                      <Button
                        title="Accept"
                        containerStyle="w-[60px] bg-[#fff242] text-xs text-black px-2 py-2 rounded-full"
                        onClick={() => acceptFriendRequest(_id, "Accepted")}
                      />

                      <Button
                        title="Deny"
                        containerStyle="w-[60px] bg-[#a6acaf] text-xs text-black px-2 py-2 rounded-full"
                        onClick={() => acceptFriendRequest(_id, "Denied")}
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
                        src={friends.avatar ?? "/user.png"}
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
                      {suggestFriends.map((friend) => {
                        return (
                          <Button
                            key={friend._id}
                            title="Add"
                            containerStyle="w-[60px] bg-[#fff242] text-xs text-black px-2 py-2 rounded-full"
                            onClick={() => {
                              sendFriendRequest(friend._id);
                            }}
                          />
                        );
                      })}
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
