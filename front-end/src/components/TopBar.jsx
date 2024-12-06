import React from "react";
import { BsSunFill, BsMoon } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import qs from "qs";

import TextInput from "./TextInput";
import Button from "./Button";

import { themeSlice } from "../redux/slice/themeSlice";
import { userSlice } from "../redux/slice/userSlice";

const { setTheme } = themeSlice.actions;
const { logout } = userSlice.actions;

const TopBar = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = async (data) => {
    const query = qs.stringify({ search: data.search });
    navigate(`/search?${query}`);
  };

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(setTheme(themeValue));
  };

  return (
    <div className="topbar w-full flex items-center justify-between mt-2 py-3 md:py-6 px-4 bg-primaryColor rounded-xl">
      <Link to="/" className="flex gap-2 items-center">
        <div className="p-1 md:p-2 bg-[#fff242] rounded text-black">
          <img src="/logo.png" alt="logo" className="w-5 h-5" />
        </div>
        <span className="text-xl md:text-2xl text-[#fff242] font-semibold">
          Cuisine Hub
        </span>
      </Link>

      <form
        className="hidden md:flex items-center justify-center"
        onSubmit={handleSubmit(handleSearch)}
      >
        <div className="relative">
          <TextInput
            name="search"
            type="text"
            placeholder="Search..."
            styles="w-[18rem] lg:w-[32rem] rounded-l-full py-2 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            register={register("search", {
              required: "Please enter a search term",
            })}
          />
          {errors.search && (
            <span className="absolute top-full mt-1 text-xs text-[#f64949fe]">
              {errors.search.message}
            </span>
          )}
        </div>

        <Button
          title="Search"
          type="submit"
          containerStyle="bg-[#fff242] text-black px-6 py-3 mt-2 rounded-r-full font-semibold"
        />
      </form>

      <div className="flex gap-4 item-center text-ascent-1 text-md md:text-xl">
        <button onClick={() => handleTheme()}>
          {theme === "light" ? <BsMoon /> : <BsSunFill />}
        </button>

        <div>
          <Button
            onClick={() => dispatch(logout())}
            title="Log Out"
            containerStyle="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
