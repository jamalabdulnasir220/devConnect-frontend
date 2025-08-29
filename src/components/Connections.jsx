import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { connectionAdded, selectedConnection } from "../api/connectionSlice";
import { selectUser } from "../api/userSlice";
import { Link, useNavigate } from "react-router";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector(selectedConnection);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const fetchConnections = async () => {
    if (!user) return;
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      //   console.log(res?.data?.connections);
      dispatch(connectionAdded(res?.data?.connections));
    } catch (error) {
      console.log(error?.response?.message);
    }
  };

  const handleChatClick = (connection) => {
    navigate(`/chat/${connection._id}`, {
      state: { firstName: connection.firstName, lastName: connection.lastName },
    });
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections || connections?.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No connections"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-4 opacity-60"
            />
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 text-center">
            No Connections Yet
          </h1>

          <p className="text-gray-600 mb-6 text-center text-sm sm:text-base leading-relaxed">
            Your network is waiting to grow! Start building meaningful
            connections by exploring profiles and reaching out to people who
            share your interests.
          </p>

          <div className="space-y-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Explore Feed
            </Link>

            <div className="text-xs text-gray-500 text-center">
              💡 Tip: Complete your profile to get better matches
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="text-center my-6 sm:my-8 lg:my-10 px-4 sm:px-6 lg:px-8">
      <h1 className="font-bold text-2xl sm:text-3xl mb-6 sm:mb-8 lg:mb-10">
        Connections
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
        {connections?.map((connection) => (
          <div
            key={connection?.firstName}
            className="flex flex-col items-center justify-between rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl bg-gray-900 p-3 sm:p-4 lg:p-5 hover:opacity-75 transition-opacity"
          >
            <div className="mb-3 sm:mb-4">
              <img
                src={connection?.photo}
                alt="photo"
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-60 xl:h-60 rounded-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">
                {connection?.firstName} {connection?.lastName}
              </h2>
              {connection?.age && connection?.gender && (
                <p className="text-xs sm:text-sm text-gray-300 mb-1 sm:mb-2">
                  {connection?.age}, {connection?.gender}
                </p>
              )}
              <p className="text-xs sm:text-sm text-gray-400 line-clamp-3 mb-3">
                {connection?.about}
              </p>
              <button
                onClick={() => handleChatClick(connection)}
                className="inline-flex items-center cursor-pointer justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
