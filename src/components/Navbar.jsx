import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, userRemoved } from "../api/userSlice";
import { feedAdded } from "../api/feedSlice";
import { Link, NavLink, useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import devMatch from "../assets/DevMatch.png";

const navLinkClass = ({ isActive }) =>
  `btn btn-ghost btn-sm gap-2 font-medium ${
    isActive ? "btn-active bg-primary/10 text-primary" : ""
  }`;

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [theme, setTheme] = useState("corporate");

  useEffect(() => {
    const savedTheme = localStorage.getItem("devconnect-theme");
    const nextTheme = savedTheme === "dark" ? "dark" : "corporate";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "corporate" ? "dark" : "corporate";
    setTheme(nextTheme);
    localStorage.setItem("devconnect-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/logout",
        {},
        { withCredentials: true }
      );
      dispatch(userRemoved());
      dispatch(feedAdded(null));
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="navbar max-w-6xl mx-auto px-2 sm:px-4 min-h-14 sm:min-h-16">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost px-2 sm:px-3 gap-2 sm:gap-3">
            <img
              src={devMatch}
              alt="DevConnect"
              className="size-8 sm:size-9 rounded-xl object-contain ring-2 ring-primary/20"
            />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DevConnect
            </span>
          </Link>
        </div>

        {user && (
          <>
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" end className={navLinkClass}>
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Discover
              </NavLink>
              <NavLink to="/connections" className={navLinkClass}>
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Connections
              </NavLink>
              <NavLink to="/request" className={navLinkClass}>
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Requests
              </NavLink>
              <NavLink to="/premium" className={navLinkClass}>
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Premium
              </NavLink>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="btn btn-ghost btn-circle"
                onClick={toggleTheme}
                aria-label={`Switch to ${
                  theme === "corporate" ? "dark" : "light"
                } mode`}
                title={`Switch to ${
                  theme === "corporate" ? "dark" : "light"
                } mode`}
              >
                {theme === "corporate" ? (
                  <svg
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.02 6.36l-.7-.7M6.34 6.34l-.7-.7m12.02 0l-.7.7M6.34 17.66l-.7.7M12 8a4 4 0 100 8 4 4 0 000-8z"
                    />
                  </svg>
                )}
              </button>
              <p className="hidden lg:block text-sm text-base-content/70">
                Hi, <span className="font-semibold text-primary">{user.firstName}</span>
              </p>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-primary/30">
                    <img
                      alt="Profile"
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
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-xl border border-base-300"
                >
                  <li className="menu-title md:hidden px-2">Navigate</li>
                  <li className="md:hidden">
                    <NavLink to="/" end>Discover</NavLink>
                  </li>
                  <li className="md:hidden">
                    <NavLink to="/connections">Connections</NavLink>
                  </li>
                  <li className="md:hidden">
                    <NavLink to="/request">Requests</NavLink>
                  </li>
                  <li className="md:hidden">
                    <NavLink to="/premium">Premium</NavLink>
                  </li>
                  <li className="md:hidden"><div className="divider my-0" /></li>
                  <li>
                    <NavLink to="/profile">Profile</NavLink>
                  </li>
                  <li>
                    <button type="button" onClick={handleLogout} className="text-error">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
