import { Outlet, useNavigate } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, userAdded } from "../api/userSlice";
import { useEffect } from "react";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(selectUser);

  const fetchUsers = async () => {
    if (!userData) {
      navigate("/login");
      return;
    }
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
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-4 max-w-7xl mx-auto w-full ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
