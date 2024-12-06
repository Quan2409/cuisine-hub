import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LiaEdit } from "react-icons/lia";
import { CiLocationOn } from "react-icons/ci";
import { BsBriefcase } from "react-icons/bs";
import moment from "moment";

import { userSlice } from "../redux/slice/userSlice";

const { updateProfile } = userSlice.actions;

const ProfileCard = ({ user }) => {
  const { user: data } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <div className="w-full bg-primaryColor flex flex-col items-center shadow-sm rounded-xl px-6 py-4">
      <div className="w-full flex items-center justify-between border-b pb-5 border-[#66666645]">
        <Link className="flex gap-2" to={`/profile/${user._id}`}>
          <img
            src={user.avatar}
            alt={user.email}
            className="w-14 h-14 object-cover rounded-full"
          />
          <div className="flex flex-col justify-center">
            <p className="text-lg font-medium text-ascent-1">
              {user.firstName} {user.lastName}
            </p>
            <span className="text-ascent-2">{user.profession}</span>
          </div>
        </Link>

        <div>
          {user._id === data._id ? (
            <LiaEdit
              className="text-yellow cursor-pointer"
              size={22}
              onClick={() => dispatch(updateProfile(true))}
            />
          ) : (
            ""
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

      <div className="w-full flex flex-col gap-2 py-4 ">
        <p className="text-xl text-ascent-1 font-semibold">
          {user.friends?.length} Friends
        </p>

        <div className="flex items-center justify-between">
          <span className="text-ascent-2">Joined</span>
          <span className="text-ascent-2">
            {user.createdAt ? moment(user.createdAt).fromNow() : "Invalid Date"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
