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
  const isChatPage = location.pathname.startsWith("/chat");
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

  const mainClass = isLoginPage
    ? "flex flex-1 items-center justify-center px-4 py-8 sm:py-12"
    : isChatPage
      ? "flex flex-1 flex-col min-h-0 w-full max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4"
      : "flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8";

  return (
    <div className="min-h-dvh flex flex-col app-shell-bg">
      {!isLoginPage && <Navbar />}
      <main className={mainClass}>
        <Outlet context={{ sessionChecked }} />
      </main>
    </div>
  );
};

export default Body;
