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

  if (!requests || requests?.length === 0) return <h1>No requests found</h1>;
  //   if (storedConnections.length === 0) return <h1>No connections found</h1>;
  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-3xl">Connection Request</h1>
      <div className="flex justify-center gap-5 my-10 flex-wrap">
        {requests?.map((request) => (
          <div
            key={request?.fromUserId?.firstName}
            className="flex flex-col w-1/5 items-center justify-between rounded-3xl shadow-2xl bg-gray-900 p-5 hover:opacity-75"
          >
            <div className="">
              <img
                src={request?.fromUserId?.photo}
                alt="photo"
                className="w-60 h-60 rounded-full object-cover"
              />
            </div>
            <div className="">
              <h2>
                {request?.fromUserId?.firstName} {request?.fromUserId?.lastName}
              </h2>
              {request?.fromUserId?.age && request?.fromUserId?.gender && (
                <p>
                  {request?.fromUserId?.age}, {request?.fromUserId?.gender}
                </p>
              )}
              <p>{request?.fromUserId?.about}</p>
            </div>
            <div className="flex justify-between gap-5 items-center">
              <button
                className="btn btn-primary"
                onClick={() => reviewRequest("Rejected", request?._id)}
              >
                Reject
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => reviewRequest("Accepted", request?._id)}
              >
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Request;
