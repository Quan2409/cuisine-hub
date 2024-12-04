import { useState } from "react";
import { useForm } from "react-hook-form";

import TextInput from "./TextInput";
import Loading from "./Loading";
import Button from "./Button";

import { sendRequest } from "../service/service";

const CommentForm = ({
  user,
  id,
  replyAt,
  comment,
  setReplyComment,
  setComments,
}) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrMsg("");

    try {
      const url = replyAt ? `/post/reply-comment/${id}` : `/post/comment/${id}`;

      const newData = {
        comment: data.comment,
        from: user.firstName + " " + user.lastName,
        replyAt: replyAt,
      };

      const response = await sendRequest({
        url: url,
        data: newData,
        token: user.token,
        method: "POST",
      });

      if (response.status === false) {
        setErrMsg(response);
      } else {
        reset({
          comment: "",
        });
        setErrMsg("");
        if (replyAt) {
          setComments((prevComments) => {
            const updateComment = prevComments.map((cmt) =>
              cmt._id === comment._id
                ? {
                    ...cmt,
                    replies: response.data.replies,
                    userId: response.data.userId,
                  }
                : cmt
            );
            console.log(updateComment);
            setReplyComment(0);
            return updateComment;
          });
        } else {
          setComments((prevComments) => [...prevComments, response.comment]);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full border-b border-[#66666645]"
      >
        <div className="w-full flex items-center gap-2 py-4">
          <img
            src={user.avatar ?? "/user.png"}
            alt={user.firstName}
            className="w-14 h-14 rounded-full object-cover"
          />

          <TextInput
            name="comment"
            styles="w-full rounded-full py-3"
            placeholder={replyAt ? `Reply ${replyAt}` : "Comment this post"}
            register={register("comment", {
              required: "Comment cannot be empty",
            })}
            error={errors.comment ? errors.comment.message : ""}
          />
        </div>
        {errMsg.message && (
          <span
            role="alert"
            className={`text-sm ${
              errMsg.status === false ? "text-[#f64949fe]" : "text-[#2ba150fe]"
            } mt-0.5`}
          ></span>
        )}

        <div className="flex items-end justify-end pb-2">
          {loading ? (
            <Loading />
          ) : (
            <Button
              title="Submit"
              type="submit"
              containerStyle="bg-[#fff242] text-white py-1 px-3 rounded-full font-semibold text-sm"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
