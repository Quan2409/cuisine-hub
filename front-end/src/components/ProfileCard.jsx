import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LiaEdit } from "react-icons/lia";
import { CiLocationOn } from "react-icons/ci";
import { BsPersonFillAdd, BsBriefcase } from "react-icons/bs";
import { UpdateProfile } from "../redux/slice/userSlice";
import moment from "moment";

const ProfileCard = ({ user }) => {
  const { user: data, edit } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <div className="w-full bg-primaryColor flex flex-col items-center shadow-sm rounded-xl px-6 py-4">
      <div className="w-full flex items-center justify-between border-b pb-5 border-[#66666645]">
        <Link to={`/prodile/` + user._id} className="flex gap-2">
          <img
            src={user.profileUrl ?? "/user.png"}
            alt={user.email}
            className="w-14 h-14 object-cover rounded-full"
          />

          <div className="flex flex-col justify-center">
            <p className="text-lg font-medium text-ascent-1">
              {user.firstName} {user.lastName}
            </p>
            <span className="text-ascent-2">
              {user.profession ?? "No Professtion"}
            </span>
          </div>
        </Link>

        <div>
          {user._id === data._id ? (
            <LiaEdit
              className="text-yellow cursor-pointer"
              size={22}
              onClick={() => dispatch(UpdateProfile(true))}
            />
          ) : (
            <button
              className="bg-[#0444a430] text-sm text-white p-2 rounded"
              onClick={() => {}}
            >
              <BsPersonFillAdd size={22} className="text-yellow" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
        <div className="flex gap-2 items-center text-ascent-2">
          <CiLocationOn className="text-xl text-ascent-1" />
          <span>{user.location ?? "Add Location"}</span>
        </div>
        <div className="flex gap-2 items-center text-ascent-2">
          <BsBriefcase className="text-lg text-ascent-1" />
          <span>{user.profession ?? "Add Professtion"}</span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
        <p className="text-xl text-ascent-1 font-semibold">
          {user.friends.length} Friends
        </p>

        <div className="flex items-center justify-between">
          <span className="text-ascent-2">Who viewd your profile</span>
          <span className="text-ascent-1 text-lg">{user.views.length}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-ascent-2">Joined</span>
          <span className="text-ascent-2">
            {moment(user.createdAt).fromNow()}
          </span>
        </div>
      </div>

      {/* <div className="w-full flex flex-col gap-4 py-4 pb-6">
        <p>Social Profile</p>
      </div> */}
    </div>
  );
};

export default ProfileCard;
