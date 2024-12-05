import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import TopBar from "../components/TopBar";
import ProfileCard from "../components/ProfileCard";
import FriendCard from "../components/FriendCard";
import PostCard from "../components/PostCard";
import Loading from "../components/Loading";
import EditProfile from "../components/EditProfile";

// import { posts } from "../assets/data";
import { postSlice } from "../redux/slice/postSlice";
import { sendRequest } from "../service/service";

const Profile = () => {
  const { id } = useParams();
  const { posts } = useSelector((state) => state.posts);
  const { user, edit } = useSelector((state) => state.user);
  const { getUserPost } = postSlice.actions;
  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState(user);
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    try {
      const response = await sendRequest({
        url: `/user/get-user/${id}`,
        token: user.token,
      });
      if (response.message === "Authentication failed") {
        localStorage.removeItem("user");
        window.alert("user session has expried. login again");
        window.location.replace("/login");
      } else {
        setUserInfo(response.user);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await sendRequest({
        url: `post/get-user-post/${id}`,
        token: user.token,
      });
      dispatch(getUserPost(response.data));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (postId) => {
    const confirm = window.confirm("Are you sure want to delete this post ?");
    if (confirm) {
      try {
        const response = await sendRequest({
          url: `/post/${postId}`,
          method: "DELETE",
          token: user.token,
        });
        await getUserPosts();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const likePost = async (postId) => {
    try {
      const response = await sendRequest({
        url: `/post/like/${postId}`,
        method: "POST",
        token: user.token,
      });
      await getUserPosts();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
    getUserPosts();
  }, [id]);

  return (
    <>
      <div className="w-full px-0 lg:px-10 pb-20 xxl:px-40 bg-backgroundColor h-screen overflow-hidden">
        <TopBar />

        <div className="flex gap-2 lg:gap-4 pt-5 pb-10 w-full h-full">
          <div className="hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={userInfo} />
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
                  deletePost={() => deletePost(post._id)}
                  likePost={() => likePost(post._id)}
                />
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">No Post Available</p>
              </div>
            )}
          </div>

          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            <FriendCard friends={userInfo.friends} />
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
    </>
  );
};

export default Profile;
