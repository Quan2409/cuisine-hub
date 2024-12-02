import { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../components/TextInput";
import Loading from "../components/Loading";
import Button from "../components/Button";
import { sendRequest } from "../service/service";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [errMsg, setErrMsg] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmit(true);
    try {
      const respone = await sendRequest({
        url: "user/reset-request",
        method: "POST",
        data: data,
      });
      console.log(respone);

      if (respone.status === false) {
        setErrMsg(respone);
      } else {
        setErrMsg(respone);
        setTimeout(() => {
          window.location.replace("/login");
        }, 5000);
      }
      setIsSubmit(false);
    } catch (error) {
      console.log(error);
      setIsSubmit(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-backgroundColor flex items-center justify-center p-6">
      <div className="bg-primaryColor w-full md:w-1/3 xxl:w1/4 px-6 py-8 shadow-md rounded-lg">
        <p className="text-ascent-1 text-lg font-semibold">Email Address</p>
        <span className="text-sm text-ascent-2">
          Enter email address you have registed
        </span>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="py-4 flex flex-col gap-5"
        >
          <TextInput
            name="email"
            placeholder="email@example.com"
            label="Email Address"
            type="email"
            register={register("email", {
              required: "Email Address is required",
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Email is wrong format",
              },
            })}
            styles="w-full rounded"
            labelStyle="ml-2"
            error={errors.email ? errors.email.message : ""}
          />

          {errMsg.message && (
            <span
              className={`text-sm ${
                errMsg.status == false ? "text-[#f64949fe]" : "text-[#2ba150fe]"
              } mt-0.5`}
            >
              {errMsg.message}
            </span>
          )}

          {isSubmit ? (
            <Loading />
          ) : (
            <Button
              type="submit"
              containerStyle={`inline-flex justify-center rounded-md bg-yellow px-8 py-3 text-sm font-medium text-white outline-none`}
              title="Send Request"
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
