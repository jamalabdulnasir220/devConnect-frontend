import { Outlet, useLocation } from "react-router";
import Navbar from "./Navbar";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, userAdded } from "../api/userSlice";
import { useEffect, useState } from "react";

const Body = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoginPage = location.pathname === "/login";
  const [sessionChecked, setSessionChecked] = useState(
    () => isLoginPage || Boolean(user)
  );

  useEffect(() => {
    if (isLoginPage) {
      setSessionChecked(true);
      return;
    }

    if (user) {
      setSessionChecked(true);
      return;
    }

    setSessionChecked(false);

    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(userAdded(res.data));
      } catch (error) {
        console.log(error);
      } finally {
        setSessionChecked(true);
      }
    };

    fetchCurrentUser();
  }, [isLoginPage, user, dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-4 mx-auto w-full">
        <Outlet context={{ sessionChecked }} />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Body;
