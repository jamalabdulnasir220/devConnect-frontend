import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  removeRequest,
  requestAdded,
  selectedRequests,
} from "../api/requestSlice";
import { selectUser } from "../api/userSlice";

const Request = () => {
  const dispatch = useDispatch();
  const requests = useSelector(selectedRequests);
  const user = useSelector(selectUser);

  const reviewRequest = async (status, requestId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(res?.data?.updatedRequest);
      dispatch(removeRequest(requestId));
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  const fetchRequests = async () => {
    if (!user) return;
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(requestAdded(res?.data?.receivedRequests));
    } catch (error) {
      console.log("Error", error?.response?.data);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests || requests?.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No requests"
          className="w-32 h-32 md:w-40 md:h-40 mb-6 opacity-70"
        />
        <h1 className="text-xl md:text-2xl font-bold text-gray-700 mb-2 text-center">
          No Requests Found
        </h1>
        <p className="text-gray-500 mb-4 text-center max-w-md">
          You have no new connection requests at the moment. Check back later or
          explore to connect with more people!
        </p>
      </div>
    );
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl text-gray-800 mb-2">
            Connection Requests
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            You have {requests?.length} pending request{requests?.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {requests?.map((request) => (
            <div
              key={request?.fromUserId?.firstName}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={request?.fromUserId?.photo}
                  alt={`${request?.fromUserId?.firstName} ${request?.fromUserId?.lastName}`}
                  className="w-full h-48 md:h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Profile Info */}
              <div className="p-6">
                <div className="text-center mb-4">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
                    {request?.fromUserId?.firstName} {request?.fromUserId?.lastName}
                  </h2>
                  {request?.fromUserId?.age && request?.fromUserId?.gender && (
                    <p className="text-sm text-gray-600 mb-2">
                      {request?.fromUserId?.age} years old • {request?.fromUserId?.gender}
                    </p>
                  )}
                  {request?.fromUserId?.about && (
                    <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                      {request?.fromUserId?.about}
                    </p>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm md:text-base"
                    onClick={() => reviewRequest("Rejected", request?._id)}
                  >
                    Decline
                  </button>
                  <button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm md:text-base"
                    onClick={() => reviewRequest("Accepted", request?._id)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Request;
