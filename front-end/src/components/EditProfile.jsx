import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";

import TextInput from "./TextInput";
import Button from "./Button";
import Loading from "./Loading";

import { userSlice } from "../redux/slice/userSlice";
import { handleUpload, sendRequest } from "../service/service";

const { login, updateProfile } = userSlice.actions;

const EditProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [file, setFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { ...user },
  });

  const onSubmit = async (data) => {
    setIsSubmit(true);
    setErrMsg("");

    try {
      const image = file && (await handleUpload(file));

      const { firstName, lastName, location, profession } = data;
      const response = await sendRequest({
        url: "/user/update-user",
        method: "PUT",
        data: {
          firstName,
          lastName,
          location,
          profession,
          avatar: image ? image : user.avatar,
        },
        token: user.token,
      });
      if (response.status === false) {
        setErrMsg(response);
      } else {
        setErrMsg(response);
        const newUser = { token: response.token, ...response.userRecord };
        localStorage.setItem("user", JSON.stringify(newUser));
        dispatch(login(newUser));
        setTimeout(() => {
          dispatch(updateProfile(false));
        }, 1500);
      }
      setIsSubmit(false);
    } catch (error) {
      console.log(error);
      setIsSubmit(false);
    }
  };

  const handleClose = () => {
    dispatch(updateProfile(false));
  };

  const handleSelect = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-[#000] opacity-70"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
          &#8230;
          <div
            className="inline-block align-bottom bg-primaryColor rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="flex justify-between px-6 pt-5 pb-2">
              <label
                htmlFor="name"
                className="block font-medium text-xl text-ascent-1 text-left"
              >
                Edit Profile
              </label>

              <button className="text-ascent-1" onClick={handleClose}>
                <MdClose size={22} />
              </button>
            </div>

            <form
              className="px-4 sm:px-6 flex flex-col gap-3 xxl:gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                name="firstName"
                label="First Name"
                placeholder="First Name"
                type="text"
                styles="w-full"
                register={register("firstName", {
                  required: "First Name is required",
                })}
                error={errors.location ? errors.location.message : ""}
              />

              <TextInput
                name="lastName"
                label="Last Name"
                placeholder="Last Name"
                type="text"
                styles="w-full"
                register={register("lastName", {
                  required: "Last Name is required",
                })}
                error={errors.location ? errors.location.message : ""}
              />

              <TextInput
                name="profession"
                label="Profession"
                placeholder="Profession"
                type="text"
                styles="w-full"
                register={register("profession")}
                error={errors.profession ? errors.profession?.message : ""}
              />

              <TextInput
                name="location"
                label="Location"
                placeholder="Location"
                type="text"
                styles="w-full"
                register={register("location")}
                error={errors.location ? errors.location.message : ""}
              />

              <label
                htmlFor="img-upload"
                className="flex items-center gap-1 text-base text-ascent02 hover:text-ascent01 cursor pointer my-4"
              >
                <input
                  type="file"
                  id="img-upload"
                  onChange={(e) => handleSelect(e)}
                  accept=".jpg, .png, .jpeg"
                />
              </label>

              {errMsg.message && (
                <span
                  role="alert"
                  className={`text-sm ${
                    errMsg.status === false
                      ? "text-[#f64949fe]"
                      : "text-[#2ba150fe]"
                  }`}
                >
                  {errMsg.message}
                </span>
              )}

              <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
                {isSubmit ? (
                  <Loading />
                ) : (
                  <Button
                    type="submit"
                    containerStyle={`inline-flex justify-center rounded-md bg-yellow px-8 py-3 text-sm font-medium text-black outline-none mr-5`}
                    title="Submit"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
