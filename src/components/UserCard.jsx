import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { feedRemoved } from "../api/feedSlice";

// Improved responsive swipe card with pointer events, keyboard support, nicer UI
export default function UserCard({ user }) {
  const dispatch = useDispatch();
  const cardRef = useRef(null);

  // drag state
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [animatingOut, setAnimatingOut] = useState(false);

  const SWIPE_THRESHOLD = 110; // pixels
  const OUT_DISTANCE = 800; // px to animate off-screen

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      // Optionally use res?.data
      dispatch(feedRemoved(userId));
    } catch (err) {
      console.error("send request error", err);
    }
  };

  // Pointer events unify mouse & touch
  const onPointerDown = (e) => {
    if (animatingOut) return;
    const point = e.nativeEvent;
    setStart({ x: point.clientX, y: point.clientY });
    setIsDragging(true);
    // capture the pointer so we still receive move/up even if pointer leaves
    try {
      e.target.setPointerCapture(e.nativeEvent.pointerId);
    } catch (e) {
      /* ignore */
    }
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const point = e.nativeEvent;
    const dx = point.clientX - start.x;
    const dy = point.clientY - start.y;
    setOffset({ x: dx, y: dy });
  };

  const finishDrag = (finalOffsetX) => {
    // Determine action
    if (Math.abs(finalOffsetX) > SWIPE_THRESHOLD) {
      const isRight = finalOffsetX > 0;
      // animate out
      setAnimatingOut(true);
      setOffset({ x: isRight ? OUT_DISTANCE : -OUT_DISTANCE, y: offset.y });
      // after animation completes, call server and remove from feed
      setTimeout(() => {
        handleSendRequest(isRight ? "Interested" : "Ignored", user._id);
      }, 300);
    } else {
      // snap back
      setOffset({ x: 0, y: 0 });
    }
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    finishDrag(offset.x);
    try {
      e.target.releasePointerCapture(e.nativeEvent.pointerId);
    } catch (err) {
      /* ignore */
    }
  };

  // Keyboard support: left -> pass, right -> like
  useEffect(() => {
    const handleKey = (ev) => {
      if (animatingOut) return;
      if (ev.key === "ArrowLeft") {
        // animate left and call
        setAnimatingOut(true);
        setOffset({ x: -OUT_DISTANCE, y: 0 });
        setTimeout(() => handleSendRequest("Ignored", user._id), 300);
      } else if (ev.key === "ArrowRight") {
        setAnimatingOut(true);
        setOffset({ x: OUT_DISTANCE, y: 0 });
        setTimeout(() => handleSendRequest("Interested", user._id), 300);
      }
    };

    // make the card focusable and listen globally so users can use keyboard
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [animatingOut, user?._id]);

  // If the card's user prop changes (new card), reset states
  useEffect(() => {
    setIsDragging(false);
    setOffset({ x: 0, y: 0 });
    setAnimatingOut(false);
  }, [user?._id]);

  // Transform styles
  const rotation = offset.x * 0.06; // subtle rotate
  const scale = isDragging ? 1.02 : 1;
  const opacity = Math.max(0.85, 1 - Math.abs(offset.x) / 1200);

  const cardStyle = {
    transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${scale})`,
    transition: animatingOut ? "transform 0.3s ease-out" : isDragging ? "none" : "transform 0.25s cubic-bezier(.2,.9,.3,1)",
    cursor: isDragging ? "grabbing" : "grab",
    opacity,
  };

  // Indicator
  const indicatorVisible = Math.abs(offset.x) > 30;
  const isRight = offset.x > 0;
  const indicatorProgress = Math.min(Math.abs(offset.x) / SWIPE_THRESHOLD, 1);

  return (
    <div className="flex items-center justify-center w-full p-3 sm:p-6">
      <div
        ref={cardRef}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          setIsDragging(false);
          finishDrag(offset.x);
        }}
        className="relative w-full max-w-sm sm:max-w-md md:max-w-sm lg:max-w-md rounded-3xl shadow-xl bg-white overflow-hidden"
        style={cardStyle}
      >
        {/* Image header */}
        <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 w-full">
          <img
            src={user?.photo}
            alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Top-left small badge: age/gender */}
          <div className="absolute left-4 top-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium">
            {user?.age ? `${user.age}` : "—"}
            {user?.gender ? ` • ${user.gender}` : ""}
          </div>

          {/* Name */}
          <div className="absolute left-4 bottom-4 text-white">
            <h3 className="text-lg sm:text-2xl md:text-3xl font-bold leading-tight">
              {user?.firstName} {user?.lastName}
            </h3>
            {user?.location && (
              <p className="text-sm opacity-90">{user.location}</p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 md:p-6 flex flex-col gap-4 bg-white">
          <div className="flex-1">
            <h4 className="text-sm sm:text-base font-semibold text-gray-700">About</h4>
            <p className="mt-2 text-gray-600 text-sm sm:text-base leading-relaxed">
              {user?.about || "No description available."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAnimatingOut(true);
                setOffset({ x: -OUT_DISTANCE, y: 0 });
                setTimeout(() => handleSendRequest("Ignored", user._id), 300);
              }}
              className="flex-1 py-2.5 rounded-2xl text-sm sm:text-base font-semibold shadow-md bg-gradient-to-r from-red-500 to-red-600 text-white hover:scale-105 active:scale-95"
            >
              <span className="mr-2">✕</span> Pass
            </button>

            <button
              onClick={() => {
                setAnimatingOut(true);
                setOffset({ x: OUT_DISTANCE, y: 0 });
                setTimeout(() => handleSendRequest("Interested", user._id), 300);
              }}
              className="flex-1 py-2.5 rounded-2xl text-sm sm:text-base font-semibold shadow-md bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-105 active:scale-95"
            >
              <span className="mr-2">❤️</span> Like
            </button>
          </div>

          <p className="text-center text-xs sm:text-sm text-gray-400">Swipe left to pass, right to like — or use ← / → keys</p>
        </div>

        {/* Swipe indicator overlay */}
        {indicatorVisible && (
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 flex items-center justify-center rounded-3xl transition-opacity duration-150`}
            style={{ opacity: Math.min(0.95, indicatorProgress * 1.2) }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl select-none">{isRight ? "❤️" : "❌"}</div>
              <div className="mt-2 text-lg font-bold text-white">
                {isRight ? "Interested" : "Pass"}
              </div>
              <div className="mt-1 text-xs text-white/90">{Math.round(indicatorProgress * 100)}%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

