import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userAdded } from "../api/userSlice";
import { useLocation, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import devMatch from "../assets/DevMatch.png";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrMessage("");
    try {
      const result = await axios.post(
        BASE_URL + "/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(userAdded(result?.data?.user));
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrMessage(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    setErrMessage("");
    try {
      const res = await axios.post(
        `${BASE_URL}/signup`,
        { firstName, lastName, email, password },
        { withCredentials: true }
      );
      dispatch(userAdded(res?.data?.data));
      navigate("/profile");
    } catch (error) {
      setErrMessage(error?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div className="hidden lg:flex flex-col justify-center px-4">
        <img
          src={devMatch}
          alt="DevConnect"
          className="size-16 rounded-2xl ring-4 ring-primary/20 mb-6"
        />
        <h1 className="text-4xl font-bold tracking-tight text-base-content mb-3">
          Connect with developers who get you
        </h1>
        <p className="text-base-content/60 text-lg leading-relaxed max-w-md">
          Swipe through profiles, send connection requests, and chat with your
          matches — all in one place.
        </p>
        <ul className="mt-8 space-y-3 text-base-content/70">
          <li className="flex items-center gap-3">
            <span className="badge badge-primary badge-sm">1</span>
            Build your developer profile
          </li>
          <li className="flex items-center gap-3">
            <span className="badge badge-primary badge-sm">2</span>
            Discover people in your feed
          </li>
          <li className="flex items-center gap-3">
            <span className="badge badge-primary badge-sm">3</span>
            Chat when you both connect
          </li>
        </ul>
      </div>

      <div className="page-card w-full max-w-md mx-auto lg:max-w-none shadow-lg">
        <div className="card-body p-6 sm:p-8">
          <div className="flex flex-col items-center lg:items-start mb-6">
            <img
              src={devMatch}
              alt=""
              className="size-12 rounded-xl lg:hidden mb-4 ring-2 ring-primary/20"
            />
            <h2 className="text-2xl font-bold text-primary">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-base-content/60 text-sm mt-1 text-center lg:text-left">
              {isLogin
                ? "Sign in to continue to DevConnect"
                : "Join the developer community"}
            </p>
          </div>

          <fieldset className="fieldset gap-3">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <label className="fieldset">
                  <span className="fieldset-legend text-xs">First name</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Jamal"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="fieldset">
                  <span className="fieldset-legend text-xs">Last name</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Nasir"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </div>
            )}
            <label className="fieldset">
              <span className="fieldset-legend text-xs">Email</span>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="jamal@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="fieldset">
              <span className="fieldset-legend text-xs">Password</span>
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </fieldset>

          {errMessage && (
            <div role="alert" className="alert alert-error alert-soft mt-4 text-sm">
              <span>{errMessage}</span>
            </div>
          )}

          <button
            className="btn btn-primary w-full mt-6"
            onClick={isLogin ? handleLogin : handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : isLogin ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </button>

          <p className="text-center text-sm mt-5 text-base-content/60">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="link link-primary font-medium"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrMessage("");
              }}
            >
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
