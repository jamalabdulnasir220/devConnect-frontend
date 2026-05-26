import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { connectionAdded, selectedConnection } from "../api/connectionSlice";
import { selectUser } from "../api/userSlice";
import { useNavigate } from "react-router";
import PageHeader from "./PageHeader";
import EmptyState from "./EmptyState";

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
      dispatch(connectionAdded(res?.data?.connections));
    } catch (error) {
      console.log(error?.response?.message);
    }
  };

  const handleChatClick = (connection) => {
    navigate(`/chat/${connection._id}`, {
      state: {
        firstName: connection.firstName,
        lastName: connection.lastName,
      },
    });
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections || connections?.length === 0) {
    return (
      <>
        <PageHeader
          title="Connections"
          description="People you've matched with"
        />
        <EmptyState
          icon="🤝"
          title="No connections yet"
          description="When someone accepts your request (or you accept theirs), they'll show up here. Head to Discover to find your first match."
          actionLabel="Go to Discover"
          actionTo="/"
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Connections"
        description={`${connections.length} connection${connections.length !== 1 ? "s" : ""}`}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {connections.map((connection) => (
          <article
            key={connection._id || connection.firstName}
            className="page-card overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-square relative bg-base-300">
              <img
                src={connection?.photo}
                alt={`${connection?.firstName} ${connection?.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 sm:p-5">
              <h2 className="font-semibold text-lg text-base-content">
                {connection?.firstName} {connection?.lastName}
              </h2>
              {connection?.age && connection?.gender && (
                <p className="text-sm text-base-content/50 mt-0.5">
                  {connection.age} · {connection.gender}
                </p>
              )}
              {connection?.about && (
                <p className="text-sm text-base-content/70 mt-2 line-clamp-2">
                  {connection.about}
                </p>
              )}
              <button
                type="button"
                onClick={() => handleChatClick(connection)}
                className="btn btn-primary btn-sm w-full mt-4 gap-2"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Message
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default Connections;
