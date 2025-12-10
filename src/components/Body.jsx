import { Outlet, useNavigate } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, userAdded } from "../api/userSlice";
import { useEffect } from "react";
import { feedAdded } from "../api/feedSlice";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });

      dispatch(feedAdded(res?.data?.feedUsers));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(userAdded(res.data));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        return;
      }
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFeed()
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-4 mx-auto w-full">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Body;
