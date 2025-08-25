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
      dispatch(feedAdded(res.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div className="max-h-full flex justify-center mt-20">
      <UserCard user={feed?.feedUsers[0]} />
    </div>
  );
};

export default Feed;
