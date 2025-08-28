import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, userRemoved } from "../api/userSlice";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import devMatch from "../assets/DevMatch.png";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/logout",
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(userRemoved());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-lg border-b border-base-200">
      <div className="flex-1">
        <Link
          to={"/"}
          className="btn btn-ghost normal-case hover:bg-base-200 transition-all duration-200"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <img
              src={devMatch}
              alt="DevConnect Logo"
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain drop-shadow-sm bg-amber-800 rounded-full"
            />
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DevConnect
            </span>
          </div>
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          <p className="text-xs sm:text-sm md:text-base hidden sm:block text-base-content/80 font-medium">
            Welcome,{" "}
            <span className="text-primary font-semibold">{user.firstName}</span>
          </p>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform duration-200"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
                <img
                  alt="User profile"
                  src={
                    user.photo ||
                    "https://via.placeholder.com/40x40/6B7280/FFFFFF?text=U"
                  }
                  className="object-cover"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-48 md:w-52 p-2 shadow-xl border border-base-200"
            >
              <li>
                <Link
                  to={"/profile"}
                  className="justify-between text-sm md:text-base hover:bg-primary/10 transition-colors duration-200"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </span>
                  <span className="badge badge-primary badge-sm">New</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/connections"}
                  className="text-sm md:text-base hover:bg-primary/10 transition-colors duration-200"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Connections
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/request"}
                  className="text-sm md:text-base hover:bg-primary/10 transition-colors duration-200"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Requests
                  </span>
                </Link>
              </li>
              <div className="divider my-1"></div>
              <li>
                <a
                  onClick={handleLogout}
                  className="text-sm md:text-base hover:bg-error/10 text-error hover:text-error transition-colors duration-200"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
