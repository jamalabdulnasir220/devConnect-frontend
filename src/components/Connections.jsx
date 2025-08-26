import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { connectionAdded, selectedConnection } from "../api/connectionSlice";
import { selectUser } from "../api/userSlice";
import { Link } from "react-router";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector(selectedConnection);
  const user = useSelector(selectUser);

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

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections || connections?.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No connections"
          className="w-40 h-40 mb-6 opacity-70"
        />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">No Connections Found</h1>
        <p className="text-gray-500 mb-4">
          You haven't made any connections yet. Start exploring and connect with new people!
        </p>
        <Link
          to="/"
          className="btn btn-primary px-6 py-2 rounded-full shadow hover:scale-105 transition-transform"
        >
          Go to Feed
        </Link>
      </div>
    );
  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-3xl">Connections</h1>
      <div className="flex justify-center gap-5 my-10 flex-wrap">
        {connections?.map((connection) => (
          <div
            key={connection?.firstName}
            className="flex flex-col w-1/5 items-center justify-between rounded-3xl shadow-2xl bg-gray-900 p-5 hover:opacity-75"
          >
            <div className="">
              <img
                src={connection?.photo}
                alt="photo"
                className="w-60 h-60 rounded-full object-cover"
              />
            </div>
            <div className="">
              <h2>
                {connection?.firstName} {connection?.lastName}
              </h2>
              {connection?.age && connection?.gender && (
                <p>
                  {connection?.age}, {connection?.gender}
                </p>
              )}
              <p>{connection?.about}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
