import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { feedAdded, selectFeed } from "../api/feedSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { selectUser } from "../api/userSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector(selectFeed);
  const userData = useSelector(selectUser);

  const fetchFeed = async () => {
    if (feed || !userData) return;
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
    
      dispatch(feedAdded(res?.data?.feedUsers));
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchFeed();
  }, []);

  if (!feed || feed?.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No feed"
          className="w-40 h-40 mb-6 opacity-70"
        />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          No Feed Available
        </h1>
        <p className="text-gray-500 mb-4">
          There are currently no new users to show in your feed. Check back later or update your profile to get better matches!
        </p>
      </div>
    );

  return (
    <div className="max-h-full flex justify-center mt-20">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
