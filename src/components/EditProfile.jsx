import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { userAdded } from "../api/userSlice";
import UserCard from "./UserCard";
import Toast from "./Toast";


const EditProfile = ({ user: initialUser }) => {
  const dispatch = useDispatch();
  // Use initialUser props to seed form
  const [firstName, setFirstName] = useState(initialUser?.firstName || "");
  const [lastName, setLastName] = useState(initialUser?.lastName || "");
  const [age, setAge] = useState(initialUser?.age || "");
  const [gender, setGender] = useState(initialUser?.gender || "");
  const [about, setAbout] = useState(initialUser?.about || "");
  const [photo, setPhoto] = useState(initialUser?.photo || "");

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialUser?.photo || "");
  const [errMessage, setErrMessage] = useState("");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  // small helper: validate fields before submit
  const validate = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setErrMessage("Please provide your first and last name.");
      return false;
    }
    if (age && (Number(age) <= 0 || Number(age) > 120)) {
      setErrMessage("Please enter a valid age.");
      return false;
    }
    return true;
  };

  // File selection & preview
  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrMessage("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrMessage("Image must be smaller than 5MB.");
      return;
    }

    setSelectedFile(file);
    setErrMessage("");

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e) => handleFileSelect(e.target.files[0]);

  // Drag & drop handlers
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    const handleDragOver = (ev) => {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "copy";
      el.classList.add("ring-2", "ring-offset-2", "ring-indigo-300");
    };
    const handleDragLeave = () => {
      el.classList.remove("ring-2", "ring-offset-2", "ring-indigo-300");
    };
    const handleDrop = (ev) => {
      ev.preventDefault();
      el.classList.remove("ring-2", "ring-offset-2", "ring-indigo-300");
      const f = ev.dataTransfer.files && ev.dataTransfer.files[0];
      if (f) handleFileSelect(f);
    };

    el.addEventListener("dragover", handleDragOver);
    el.addEventListener("dragleave", handleDragLeave);
    el.addEventListener("drop", handleDrop);

    return () => {
      el.removeEventListener("dragover", handleDragOver);
      el.removeEventListener("dragleave", handleDragLeave);
      el.removeEventListener("drop", handleDrop);
    };
  }, [dropRef.current]);

  const saveProfile = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      let photoUrl = photo;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("photo", selectedFile);

        const uploadRes = await axios.post(BASE_URL + "/upload/photo", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });

        photoUrl = uploadRes?.data?.photoUrl || photoUrl;
      }

      const res = await axios.post(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, gender, photo: photoUrl, about },
        { withCredentials: true }
      );

      dispatch(userAdded(res?.data?.data || { ...initialUser, firstName, lastName, age, gender, about, photo: photoUrl }));
      setMessage(res?.data?.message || "Profile updated");
      setErrMessage("");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("saveProfile error", error);
      setErrMessage(error?.response?.data?.message || "Failed to save profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Live preview (card) */}
        <div className="order-1 lg:order-1">
          <div className="sticky top-6">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Live Preview</h3>
              <UserCard user={{ firstName, lastName, photo: previewUrl || photo, age, gender, about }} />

              <div className="mt-4 text-center text-sm text-gray-500">This preview updates as you change the form.</div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="order-2 lg:order-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm text-gray-700">First name</span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-200 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-200"
                    placeholder="First name"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">Last name</span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-200 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-200"
                    placeholder="Last name"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label>
                  <span className="text-sm text-gray-700">Age</span>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-200 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-200"
                    placeholder="Age"
                  />
                </label>

                <label>
                  <span className="text-sm text-gray-700">Gender</span>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-200 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Other</option>
                  </select>
                </label>

                <div />
              </div>

              <label className="block">
                <span className="text-sm text-gray-700">About</span>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-lg border-gray-200 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-200"
                  placeholder="Tell something about yourself"
                />
              </label>

              <div>
                <span className="text-sm text-gray-700">Profile photo</span>
                <div
                  ref={dropRef}
                  className="mt-2 flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {previewUrl ? (
                      <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-400 text-xs">No photo</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow-sm hover:brightness-95"
                      >
                        Upload
                      </button>

                      <button
                        type="button"
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 border"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl("");
                          setPhoto("");
                        }}
                      >
                        Remove
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onFileInputChange}
                        className="hidden"
                      />
                    </div>

                    <p className="mt-2 text-sm text-gray-500">Drag & drop an image here, or click Upload. Max 5MB.</p>
                  </div>
                </div>
              </div>

              {errMessage && <div className="text-sm text-red-600">{errMessage}</div>}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    // reset to initial values
                    setFirstName(initialUser?.firstName || "");
                    setLastName(initialUser?.lastName || "");
                    setAge(initialUser?.age || "");
                    setGender(initialUser?.gender || "");
                    setAbout(initialUser?.about || "");
                    setPreviewUrl(initialUser?.photo || "");
                    setSelectedFile(null);
                    setErrMessage("");
                  }}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-700"
                >
                  Reset
                </button>

                <button
                  onClick={saveProfile}
                  disabled={loading}
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showToast && <Toast message={message} />}
    </div>
  );
};

export default EditProfile


