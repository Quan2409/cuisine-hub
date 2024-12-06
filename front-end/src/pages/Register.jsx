import { useState } from "react";
import { Link } from "react-router-dom";
import { TbSocial } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import TextInput from "../components/TextInput";
import Loading from "../components/Loading";
import Button from "../components/Button";

import { sendRequest } from "../service/service";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [errMsg, setErrMsg] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  // regex for name: no contain special character & whitespace
  const nameRegex = /^[a-zA-Z0-9]+([a-zA-Z0-9\s]*[a-zA-Z0-9]+)*$/;

  // regex for email: enter right email format
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  // regex for password: no contain whitespace
  const passwordRegex = /^\S+$/;

  const onSubmit = async (data) => {
    setIsSubmit(true);
    try {
      const response = await sendRequest({
        url: "/auth/register",
        method: "POST",
        data: data,
      });
      if (response.status === false) {
        setErrMsg(response);
      } else {
        setErrMsg(response);
      }
      setIsSubmit(false);
    } catch (error) {
      console.log(error);
      setIsSubmit(false);
    }
  };

  return (
    <div className="bg-backgroundColor w-full h-[100vh] flex items-center justify-center p-6">
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primaryColor rounded-xl overflow-hidden shadow-xl">
        {/* left-side */}
        <div className="w-full lg:w-1/2 h-full p-10 xxl:px-20 flex flex-col justify-center">
          <div className="w-full flex gap-2 items-center mb-6">
            <div className="p-2 bg-[#fff242] roudeed text-white">
              <TbSocial />
            </div>
            <span className="text-2xl text-[#fff242]">Cuisine Hub</span>
          </div>

          <div>
            <p className="text-ascent-1 text-base font-semibold">
              Create an account to join the Cuisine Hub
            </p>
          </div>

          <form
            className="py-8 flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
              <TextInput
                name="firstName"
                placeholder="First Name"
                label="First Name"
                type="text"
                register={register("firstName", {
                  required: "First Name is required",
                  pattern: {
                    value: nameRegex,
                    message:
                      "First Name must not contain special characters or start/end with spaces",
                  },
                })}
                styles="w-full rounded"
                labelStyle="ml-2"
                error={errors.firstName ? errors.firstName.message : ""}
              />

              <TextInput
                name="lastName"
                placeholder="Last Name"
                label="Last Name"
                type="text"
                register={register("lastName", {
                  required: "Last Name is required",
                  pattern: {
                    value: nameRegex,
                    message:
                      "Last Name must not contain special characters or start/end with spaces",
                  },
                })}
                styles="w-full rounded"
                labelStyle="ml-2"
                error={errors.lastName ? errors.lastName.message : ""}
              />
            </div>

            <TextInput
              name="email"
              placeholder="email@example.com"
              label="Email Address"
              type="email"
              register={register("email", {
                required: "Email is required",
                pattern: {
                  value: emailRegex,
                  message: "Email is wrong format",
                },
              })}
              styles="w-full rounded"
              labelStyle="ml-2"
              error={errors.email ? errors.email.message : ""}
            />

            <TextInput
              name="password"
              placeholder="Password"
              label="Password"
              type="password"
              register={register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: passwordRegex,
                  message: "Password must not contain white spaces",
                },
              })}
              styles="w-full rounded"
              labelStyle="ml-2"
              error={errors.password ? errors.password.message : ""}
            />

            <TextInput
              name="confirm"
              placeholder="Confirm Password"
              label="Confirm Password"
              type="password"
              register={register("confirm", {
                required: "Confirm password is required",
                validate: (value, { password }) =>
                  value === password || "Passwords do not match",
              })}
              styles="w-full rounded"
              labelStyle="ml-2"
              error={errors.confirm ? errors.confirm.message : ""}
            />

            {errMsg.message && (
              <span
                className={`text-sm ${
                  errMsg.status == false
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
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
                title="Register"
              />
            )}
          </form>

          <p className="text-ascent-2 text-sm text-center">
            Already have account ?
            <Link
              to="/login"
              className="text-yellow font-semibold ml-2 cursor-pointer"
            >
              Sign In Now
            </Link>
          </p>
        </div>

        {/* right-side */}
        <div className="hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-yellow">
          <div className="relative w-full flex items-center justify-center">
            <img
              src="/logo.png"
              alt="image"
              className="w-48 xxl:w-64 h-48 xxl:h-64 rounded-full"
            />
          </div>
          <div className="mt-16 text-center text-black">
            <p className="text-base">
              Connect people to share all delicious recipes
            </p>
            <span className="text-sm">
              Share recipes with friend and the world
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
