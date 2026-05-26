import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { feedAdded, selectFeed } from "../api/feedSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { selectUser } from "../api/userSlice";
import UserCard from "./UserCard";
import PageHeader from "./PageHeader";
import EmptyState from "./EmptyState";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector(selectFeed);
  const userData = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userData || feed) return;

    const fetchFeed = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(BASE_URL + "/user/feed", {
          withCredentials: true,
        });
        dispatch(feedAdded(res?.data?.feedUsers));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [userData, feed, dispatch]);

  if (!userData || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!feed || feed?.length === 0) {
    return (
      <>
        <PageHeader
          title="Discover"
          description="Find developers to connect with"
        />
        <EmptyState
          icon="🔍"
          title="No one new right now"
          description="You've seen everyone in your feed for now. Check back later or polish your profile to attract more matches."
          actionLabel="Edit profile"
          actionTo="/profile"
        />
      </>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md">
        <PageHeader
          title="Discover"
          description={`${feed.length} developer${feed.length !== 1 ? "s" : ""} waiting — swipe or tap to connect`}
        />
      </div>
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
