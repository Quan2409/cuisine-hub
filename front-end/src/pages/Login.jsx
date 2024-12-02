import { useState } from "react";
import { Link } from "react-router-dom";
import { TbSocial } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import TextInput from "../components/TextInput";
import Loading from "../components/Loading";
import Button from "../components/Button";

import { userSlice } from "../redux/slice/userSlice";
import { sendRequest } from "../service/service";

const { login } = userSlice.actions;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [errMsg, setErrMsg] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setIsSubmit(true);

    try {
      const response = await sendRequest({
        url: "/auth/login",
        method: "POST",
        data: data,
      });
      if (response.status === false) {
        setErrMsg(response);
      } else {
        setErrMsg("");
        const newUser = { token: response.token, ...response.user };
        dispatch(login(newUser));
        window.location.replace("/");
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
              Sign In To Your Account
            </p>
            <span className="text-sm mt-2 text-ascent-2">Welcome Back</span>
          </div>

          <form
            action=""
            className="py-8 flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
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

            <TextInput
              name="password"
              placeholder="Password"
              label="Password"
              type="password"
              register={register("password", {
                required: "Password is required",
              })}
              styles="w-full rounded"
              labelStyle="ml-2"
              error={errors.password ? errors.password.message : ""}
            />

            <Link
              to="/reset-password"
              className="text-sm text-right text-yellow font-semibold"
            >
              Forgot Password ?
            </Link>

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
                title="Login"
              />
            )}
          </form>

          <p className="text-ascent-2 text-sm text-center">
            Don't have an account ?
            <Link
              to="/register"
              className="text-yellow font-semibold ml-2 cursor-pointer"
            >
              Create Account
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
          <div className="mt-16 text-center">
            <p className="text-white text-base">
              Connect people to share all delicious recipes
            </p>
            <span className="text-sm text-white/80">
              Share recipes with friend and the world
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
