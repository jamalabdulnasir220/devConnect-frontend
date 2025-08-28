import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { feedRemoved } from "../api/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      console.log(res?.data?.savedRequest);
      dispatch(feedRemoved(userId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;

    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    // Determine swipe direction and threshold
    const swipeThreshold = 100;

    if (Math.abs(dragOffset.x) > swipeThreshold) {
      if (dragOffset.x > 0) {
        // Swipe right - Interested
        handleSendRequest("Interested", user._id);
      } else {
        // Swipe left - Ignore
        handleSendRequest("Ignored", user._id);
      }
    }

    // Reset position
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    setStartPos({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;

    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);

    // Determine swipe direction and threshold
    const swipeThreshold = 100;

    if (Math.abs(dragOffset.x) > swipeThreshold) {
      if (dragOffset.x > 0) {
        // Swipe right - Interested
        handleSendRequest("Interested", user._id);
      } else {
        // Swipe left - Ignore
        handleSendRequest("Ignored", user._id);
      }
    }

    // Reset position
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragOffset({ x: 0, y: 0 });
      }
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    return () => document.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging]);

  const cardStyle = {
    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${
      dragOffset.x * 0.1
    }deg)`,
    transition: isDragging ? "none" : "transform 0.3s ease-out",
    cursor: isDragging ? "grabbing" : "grab",
    zIndex: isDragging ? 10 : 1,
  };

  const getSwipeIndicator = () => {
    if (Math.abs(dragOffset.x) < 50) return null;

    const isRightSwipe = dragOffset.x > 0;
    const opacity = Math.min(Math.abs(dragOffset.x) / 200, 1);

    return (
      <div
        className={`absolute inset-0 flex items-center justify-center text-4xl font-bold rounded-3xl ${
          isRightSwipe
            ? "bg-gradient-to-br from-green-400 to-green-600 text-white"
            : "bg-gradient-to-br from-red-400 to-red-600 text-white"
        }`}
        style={{ opacity }}
      >
        <div className="text-center">
          <div className="text-6xl mb-2">{isRightSwipe ? "❤️" : "❌"}</div>
          <div className="text-xl font-semibold">
            {isRightSwipe ? "Interested!" : "Pass"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-sm mx-auto max-h-[70vh]">
      {getSwipeIndicator()}
      <div
        ref={cardRef}
        className="bg-white w-full max-w-[280px] sm:max-w-[300px] md:max-w-[360px] lg:max-w-[400px] h-[420px] sm:h-[420px] md:h-[460px] lg:h-[500px] shadow-2xl rounded-3xl flex flex-col overflow-hidden border-0 relative mx-auto"
        style={cardStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Profile Image with Gradient Overlay */}
        <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
          <img
            src={user?.photo}
            alt={`${user?.firstName} ${user?.lastName}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* User Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white">
            <h2 className="text-xl sm:text-xl md:text-xl lg:text-2xl font-bold mb-1">
              {user?.firstName} {user?.lastName}
            </h2>
            {user?.age && user?.gender && (
              <p className="text-base sm:text-lg md:text-xl opacity-90">
                {user.age} • {user.gender}
              </p>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col">
          {/* About Section */}
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
              About
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg">
              {user?.about || "No description available"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 sm:mt-5 md:mt-6 space-y-2 sm:space-y-3">
            <div className="flex gap-2 sm:gap-3">
              <button
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-5 md:px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-sm sm:text-base"
                onClick={() => handleSendRequest("Ignored", user._id)}
              >
                <span className="text-base sm:text-lg mr-1.5 sm:mr-2">✕</span>
                Pass
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-5 md:px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-sm sm:text-base"
                onClick={() => handleSendRequest("Interested", user._id)}
              >
                <span className="text-base sm:text-lg mr-1.5 sm:mr-2">❤️</span>
                Like
              </button>
            </div>

            {/* Swipe Hint */}
            <p className="text-center text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
              Swipe left to pass, right to like
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
