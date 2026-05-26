import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  removeRequest,
  requestAdded,
  selectedRequests,
} from "../api/requestSlice";
import { selectUser } from "../api/userSlice";
import PageHeader from "./PageHeader";
import EmptyState from "./EmptyState";

const Request = () => {
  const dispatch = useDispatch();
  const requests = useSelector(selectedRequests);
  const user = useSelector(selectUser);

  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );
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

  if (!requests || requests?.length === 0) {
    return (
      <>
        <PageHeader
          title="Requests"
          description="People who want to connect with you"
        />
        <EmptyState
          icon="📬"
          title="Inbox is empty"
          description="When someone sends you a connection request, it will appear here for you to accept or decline."
          actionLabel="Discover developers"
          actionTo="/"
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Requests"
        description={`${requests.length} pending request${requests.length !== 1 ? "s" : ""}`}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {requests.map((request) => (
          <article
            key={request._id}
            className="page-card overflow-hidden"
          >
            <div className="relative h-44 sm:h-48 bg-base-300">
              <img
                src={request?.fromUserId?.photo}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base-content/50 to-transparent" />
            </div>
            <div className="p-4 sm:p-5">
              <h2 className="font-semibold text-lg">
                {request?.fromUserId?.firstName}{" "}
                {request?.fromUserId?.lastName}
              </h2>
              {request?.fromUserId?.age && request?.fromUserId?.gender && (
                <p className="text-sm text-base-content/50 mt-0.5">
                  {request.fromUserId.age} · {request.fromUserId.gender}
                </p>
              )}
              {request?.fromUserId?.about && (
                <p className="text-sm text-base-content/70 mt-2 line-clamp-3">
                  {request.fromUserId.about}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm flex-1"
                  onClick={() => reviewRequest("Rejected", request._id)}
                >
                  Decline
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm flex-1"
                  onClick={() => reviewRequest("Accepted", request._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default Request;
