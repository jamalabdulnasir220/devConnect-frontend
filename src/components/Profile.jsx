import React from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import { selectUser } from "../api/userSlice";

const Profile = () => {
  const user = useSelector(selectUser)
  return user && (
    <div className="">
      <EditProfile user={ user} />
    </div>
  );
};

export default Profile;
