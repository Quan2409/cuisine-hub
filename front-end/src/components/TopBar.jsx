import React from "react";
import { TbSocial } from "react-icons/tb";
import { BsSunFill, BsMoon } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SetTheme } from "../redux/slice/themeSlice";
import { UserLogOut } from "../redux/slice/userSlice";
import TextInput from "./TextInput";
import Button from "./Button";

const TopBar = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSearch = async (data) => {
    //
  };

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };

  return (
    <div className="topbar w-full flex items-center justify-between mt-2 py-3 md:py-6 px-4 bg-primaryColor rounded-xl">
      <Link to="/" className="flex gap-2 items-center">
        <div className="p-1 md:p-2 bg-[#fff242] rounded text-black">
          <TbSocial />
        </div>
        <span className="text-xl md:text-2xl text-[#fff242] font-semibold">
          Cuisine Hub
        </span>
      </Link>

      <form
        className="hidden md:flex items-center justify-center"
        onSubmit={handleSubmit(handleSearch)}
      >
        <TextInput
          placeholder="Search..."
          styles="w-[18rem] lg:w-[38rem] rounded-l-full py-3"
          register={register("search")}
        />
        <Button
          title="Search"
          type="submit"
          containerStyle="bg-[#fff242] text-black px-6 py-3 mt-2 rounded-r-full"
        />
      </form>

      <div className="flex gap-4 item-center text-ascent-1 text-md md:text-xl">
        <button onClick={() => handleTheme()}>
          {theme === "light" ? <BsMoon /> : <BsSunFill />}
        </button>

        <div>
          <Button
            onClick={() => dispatch(UserLogOut())}
            title="Log Out"
            containerStyle="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
