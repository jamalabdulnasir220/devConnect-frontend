import React from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import { selectUser } from "../api/userSlice";

const Profile = () => {
  const user = useSelector(selectUser);
  if (!user) return null;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center">
            Profile
          </h1>
          <p className="text-center text-blue-100 mt-2">
            Manage your account settings and preferences
          </p>
        </div>
      </header>

      <main className="py-8">
        <EditProfile user={user} />
      </main>
    </div>
  );
};

export default Profile;
