import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { userAdded } from "../api/userSlice";
import UserCard from "./UserCard";
import Toast from "./Toast";

const EditProfile = ({ user: initialUser }) => {
  const dispatch = useDispatch();
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

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    const handleDragOver = (ev) => {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "copy";
      el.classList.add("ring-2", "ring-primary/30");
    };
    const handleDragLeave = () => {
      el.classList.remove("ring-2", "ring-primary/30");
    };
    const handleDrop = (ev) => {
      ev.preventDefault();
      el.classList.remove("ring-2", "ring-primary/30");
      const f = ev.dataTransfer.files?.[0];
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
  }, []);

  const saveProfile = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      let photoUrl = photo;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("photo", selectedFile);

        const uploadRes = await axios.post(
          BASE_URL + "/upload/photo",
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        photoUrl = uploadRes?.data?.photoUrl || photoUrl;
      }

      const res = await axios.post(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, gender, photo: photoUrl, about },
        { withCredentials: true }
      );

      dispatch(
        userAdded(
          res?.data?.data || {
            ...initialUser,
            firstName,
            lastName,
            age,
            gender,
            about,
            photo: photoUrl,
          }
        )
      );
      setMessage(res?.data?.message || "Profile updated");
      setErrMessage("");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setErrMessage(
        error?.response?.data?.message || "Failed to save profile. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
      <div className="order-2 lg:order-1">
        <div className="lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3">
            Live preview
          </p>
          <UserCard
            preview
            user={{
              firstName,
              lastName,
              photo: previewUrl || photo,
              age,
              gender,
              about,
            }}
          />
        </div>
      </div>

      <div className="order-1 lg:order-2 page-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold mb-5">Edit details</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="fieldset">
              <span className="fieldset-legend text-xs">First name</span>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="First name"
              />
            </label>
            <label className="fieldset">
              <span className="fieldset-legend text-xs">Last name</span>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Last name"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="fieldset">
              <span className="fieldset-legend text-xs">Age</span>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Age"
              />
            </label>
            <label className="fieldset">
              <span className="fieldset-legend text-xs">Gender</span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Other</option>
              </select>
            </label>
          </div>

          <label className="fieldset">
            <span className="fieldset-legend text-xs">About</span>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={4}
              className="textarea textarea-bordered w-full"
              placeholder="Tell others about yourself"
            />
          </label>

          <div>
            <span className="fieldset-legend text-xs block mb-2">Photo</span>
            <div
              ref={dropRef}
              className="flex items-center gap-4 p-4 border-2 border-dashed border-base-300 rounded-xl hover:border-primary/40 transition-colors"
            >
              <div className="size-20 rounded-xl overflow-hidden bg-base-300 shrink-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-base-content/40 text-xs">
                    No photo
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-primary btn-sm"
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
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
                <p className="mt-2 text-xs text-base-content/50">
                  Drag & drop or upload. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          {errMessage && (
            <div role="alert" className="alert alert-error alert-soft text-sm">
              <span>{errMessage}</span>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                setFirstName(initialUser?.firstName || "");
                setLastName(initialUser?.lastName || "");
                setAge(initialUser?.age || "");
                setGender(initialUser?.gender || "");
                setAbout(initialUser?.about || "");
                setPreviewUrl(initialUser?.photo || "");
                setSelectedFile(null);
                setErrMessage("");
              }}
              className="btn btn-ghost"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={saveProfile}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Save profile"
              )}
            </button>
          </div>
        </div>
      </div>

      {showToast && <Toast message={message} />}
    </div>
  );
};

export default EditProfile;
