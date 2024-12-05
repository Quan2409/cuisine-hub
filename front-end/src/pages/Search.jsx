import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { BiImageAdd } from "react-icons/bi";
import qs from "qs";

import TopBar from "../components/TopBar";
import Loading from "../components/Loading";
import PostCard from "../components/PostCard";
import TextInput from "../components/TextInput";
import Button from "../components/Button";

import { sendRequest } from "../service/service";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadPost, setIsLoadPost] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [fileName, setFilenName] = useState("");
  const [isPost, setIsPosting] = useState(false);
  const location = useLocation();

  const { posts } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.user);

  const params = qs.parse(location.search, { ignoreQueryPrefix: true });
  const searchQuery = params.search;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const resultData = async () => {
    try {
      const response = await sendRequest({
        url: "post/search",
        method: "POST",
        token: user.token,
        data: { search: searchQuery },
      });
      console.log(response);
      setSearchResults(response.data);
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
        await resultData();
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
      await resultData();
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
        await resultData();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    resultData();
  }, [location.search]);

  return (
    <>
      <div className="px-0 pb-20 w-full h-screen overflow-hidden bg-backgroundColor lg:px-10 xxl:px-40 ">
        <TopBar />
        <div className="flex gap-2 pt-5 pb-10 w-1/2 h-full justify-center mx-auto lg:gap-4">
          <div className="flex-1 h-full px-4 flex flex-col gap-6 rounded-lg overflow-y-auto overscroll-y-auto">
            {isLoadPost ? (
              <Loading />
            ) : searchResults.length > 0 ? (
              searchResults.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  user={user}
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
        </div>
      </div>
    </>
  );
};

export default Search;
