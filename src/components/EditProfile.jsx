import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { userAdded } from "../api/userSlice";
import Toast from "./Toast";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = React.useState(user?.firstName);
  const [lastName, setLastName] = React.useState(user?.lastName);
  const [age, setAge] = React.useState(user?.age || 0);
  const [gender, setGender] = React.useState(user?.gender);
  const [about, setAbout] = React.useState(user?.about);
  const [photo, setPhoto] = React.useState(user?.photo);
  const [errMessage, setErrMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  const saveProfile = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, gender, photo, about },
        {
          withCredentials: true,
        }
      );
      dispatch(userAdded(res?.data?.data));
      setMessage(res?.data?.message);
      setErrMessage("");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.log("Error", error);
      setErrMessage(error?.response?.data);
    }
  };

  return (
    <div className="flex justify-center gap-5 overflow-y-auto my-5">
      <div className="max-h-[73vh] overflow-auto">
        <div className="card card-border bg-base-300 w-96">
          <div className="card-body">
            <h2 className="card-title flex justify-center">Edit Profile</h2>
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">First Name</legend>
                <input
                  type="text"
                  className="input focus:outline-none focus:border-none"
                  placeholder="first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <legend className="fieldset-legend">Last Name</legend>
                <input
                  type="text"
                  className="input focus:outline-none focus:border-none"
                  placeholder="last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <legend className="fieldset-legend">Age</legend>
                <input
                  type="number"
                  className="input focus:outline-none focus:border-none"
                  placeholder="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
                <legend className="fieldset-legend">Gender</legend>
                <select
                  className="input focus:outline-none focus:border-none"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
                <legend className="fieldset-legend">About</legend>
                <textarea
                  className="textarea focus:outline-none focus:border-none"
                  placeholder="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows="3"
                />
                <legend className="fieldset-legend">Photo</legend>
                <input
                  type="text"
                  className="input focus:outline-none focus:border-none"
                  placeholder="photo"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                />
              </fieldset>
            </div>
            {errMessage && <p className="text-red-500">{errMessage}</p>}
            <div className="card-actions justify-center">
              <button className="btn btn-primary" onClick={saveProfile}>
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <UserCard user={{ firstName, lastName, photo, age, gender, about }} />
      </div>

      {showToast && <Toast message={message} />}
    </div>
  );
};

export default EditProfile;
