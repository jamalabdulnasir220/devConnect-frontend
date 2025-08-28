import React from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import { selectUser } from "../api/userSlice";

const Profile = () => {
  const user = useSelector(selectUser);
  return (
    user && (
      // <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      //   <div className="max-w-4xl mx-auto">
      //     <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      //       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 sm:px-8">
      //         <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
      //           Profile
      //         </h1>
      //         <p className="mt-2 text-blue-100 text-center text-lg">
      //           Manage your account settings and preferences
      //         </p>
      //       </div>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 sm:px-8 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
            Profile
          </h1>
          <p className="text-blue-100 text-center text-lg">
            Manage your account settings and preferences
          </p>
        </div>
        <EditProfile user={user} />
      </div>
      //     </div>
      //   </div>
      // </div>
    )
  );
};

export default Profile;
