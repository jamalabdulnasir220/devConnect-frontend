import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userAdded } from "../api/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrMessage("");
    try {
      const result = await axios.post(
        BASE_URL + "/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(userAdded(result?.data?.user));
      navigate("/");
    } catch (error) {
      setErrMessage(error?.response?.data?.message);
      console.log(error)
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
        {
          firstName,
          lastName,
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(userAdded(res?.data?.data));
      navigate("/profile");
    } catch (error) {
      console.log(error);
      setErrMessage(error?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-4">
      <div className="card card-border bg-base-300 w-full max-w-sm sm:w-96">
        <div className="card-body p-4 sm:p-6">
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <h2 className="card-title text-2xl sm:text-3xl font-bold text-center text-primary mb-2 drop-shadow-sm tracking-wide">
              {isLogin ? "Welcome Back!" : "Create Your Account"}
            </h2>
            <p className="text-gray-500 text-center text-xs sm:text-sm">
              {isLogin ? "Please login to continue" : "Sign up to get started"}
            </p>
          </div>
          <div>
            <fieldset className="fieldset">
              {!isLogin && (
                <>
                  <legend className="fieldset-legend text-sm">
                    First Name
                  </legend>
                  <input
                    type="text"
                    className="input focus:outline-none text-sm"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <legend className="fieldset-legend text-sm">Last Name</legend>
                  <input
                    type="text"
                    className="input focus:outline-none text-sm"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </>
              )}
              <legend className="fieldset-legend text-sm">Email</legend>
              <input
                type="email"
                className="input focus:outline-none text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <legend className="fieldset-legend text-sm">Password</legend>
              <input
                type="password"
                className="input focus:outline-none text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>
          </div>
          <p className="text-red-500 text-center text-xs sm:text-sm">
            {errMessage}
          </p>
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary w-full mt-2 text-sm sm:text-base"
              onClick={isLogin ? handleLogin : handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="text-xs sm:text-sm">
                    {isLogin ? "Logging in..." : "Creating account..."}
                  </span>
                </div>
              ) : isLogin ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
          <p
            className="cursor-pointer text-blue-600 hover:underline mt-4 text-center font-medium transition-colors duration-200 text-xs sm:text-sm"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "New User? Sign Up Here" : "Existing User? Login"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
