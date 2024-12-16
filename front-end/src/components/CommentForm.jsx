import { useState } from "react";
import { useForm } from "react-hook-form";

import TextInput from "./TextInput";
import Loading from "./Loading";
import Button from "./Button";

import { sendRequest } from "../service/service";

const CommentForm = ({
  user,
  postId,
  id,
  replyAt,
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
      const url = replyAt
        ? `/post/reply-comment/${id}`
        : `/post/comment/${postId}`;

      const newData = {
        comment: data.comment,
        userId: user._id,
        from: `${user.firstName} ${user.lastName}`,
      };

      const response = await sendRequest({
        url: url,
        data: newData,
        token: user.token,
        method: "POST",
      });

      console.log(response.data);

      if (response.status === false) {
        setErrMsg(response.message);
        setLoading(false);
        return;
      }

      const { data: newComment, data: replies } = response;
      const updateReplies = (comments, replyId, replyData) => {
        const updatedComments = comments.map((comment) => {
          // Nếu comment hiện tại trùng với replyId, cập nhật replies
          if (comment._id === replyId) {
            return {
              ...comment,
              replies: [
                ...(comment.replies || []), // Nếu không có replies thì tạo mảng rỗng
                {
                  ...replyData,
                  userId: replyData.userId || comment.userId, // Sử dụng đúng userId của replyData
                },
              ],
            };
          }

          // Nếu comment có replies, cần phải tiếp tục đệ quy
          if (Array.isArray(comment.replies) && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateReplies(comment.replies, replyId, replyData), // Đệ quy để cập nhật replies
            };
          }

          return comment; // Trả lại comment gốc nếu không thay đổi
        });

        return updatedComments;
      };

      setComments((prevComments) => {
        if (id) {
          const updatedComments = updateReplies(prevComments, id, replies);
          console.log(updatedComments);

          // Trả lại danh sách bình luận đã được cập nhật
          return updatedComments;
        } else {
          return [...prevComments, newComment];
        }
      });

      setReplyComment(0);
      reset({ comment: "" });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <>
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
            placeholder={replyAt ? `Reply ${id}` : "Comment this post"}
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
    </>
  );
};

export default CommentForm;
