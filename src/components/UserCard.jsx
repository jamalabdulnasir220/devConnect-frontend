import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { feedRemoved } from "../api/feedSlice";

export default function UserCard({ user, preview = false }) {
  const dispatch = useDispatch();
  const cardRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [animatingOut, setAnimatingOut] = useState(false);

  const SWIPE_THRESHOLD = 110;
  const OUT_DISTANCE = 800;

  const handleSendRequest = async (status, userId) => {
    if (preview) return;
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(feedRemoved(userId));
    } catch (err) {
      console.error("send request error", err);
    }
  };

  const onPointerDown = (e) => {
    if (preview || animatingOut) return;
    const point = e.nativeEvent;
    setStart({ x: point.clientX, y: point.clientY });
    setIsDragging(true);
    try {
      e.target.setPointerCapture(e.nativeEvent.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onPointerMove = (e) => {
    if (!isDragging || preview) return;
    const point = e.nativeEvent;
    setOffset({ x: point.clientX - start.x, y: point.clientY - start.y });
  };

  const finishDrag = (finalOffsetX) => {
    if (preview) return;
    if (Math.abs(finalOffsetX) > SWIPE_THRESHOLD) {
      const isRight = finalOffsetX > 0;
      setAnimatingOut(true);
      setOffset({ x: isRight ? OUT_DISTANCE : -OUT_DISTANCE, y: offset.y });
      setTimeout(() => {
        handleSendRequest(isRight ? "Interested" : "Ignored", user._id);
      }, 300);
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    finishDrag(offset.x);
    try {
      e.target.releasePointerCapture(e.nativeEvent.pointerId);
    } catch {
      /* ignore */
    }
  };

  const animateSwipe = (direction) => {
    if (preview) return;
    setAnimatingOut(true);
    setOffset({ x: direction === "right" ? OUT_DISTANCE : -OUT_DISTANCE, y: 0 });
    setTimeout(
      () =>
        handleSendRequest(
          direction === "right" ? "Interested" : "Ignored",
          user._id
        ),
      300
    );
  };

  useEffect(() => {
    if (preview) return;
    const handleKey = (ev) => {
      if (animatingOut) return;
      if (ev.key === "ArrowLeft") animateSwipe("left");
      else if (ev.key === "ArrowRight") animateSwipe("right");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [animatingOut, user?._id, preview]);

  useEffect(() => {
    setIsDragging(false);
    setOffset({ x: 0, y: 0 });
    setAnimatingOut(false);
  }, [user?._id]);

  const rotation = offset.x * 0.06;
  const scale = isDragging ? 1.02 : 1;
  const opacity = Math.max(0.85, 1 - Math.abs(offset.x) / 1200);

  const cardStyle = preview
    ? {}
    : {
        transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${scale})`,
        transition: animatingOut
          ? "transform 0.3s ease-out"
          : isDragging
            ? "none"
            : "transform 0.25s cubic-bezier(.2,.9,.3,1)",
        cursor: isDragging ? "grabbing" : "grab",
        opacity,
      };

  const indicatorVisible = !preview && Math.abs(offset.x) > 30;
  const isRight = offset.x > 0;
  const indicatorProgress = Math.min(Math.abs(offset.x) / SWIPE_THRESHOLD, 1);

  return (
    <div
      className={`flex items-center justify-center w-full ${preview ? "" : "pb-4"}`}
    >
      <div
        ref={cardRef}
        tabIndex={preview ? -1 : 0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          setIsDragging(false);
          finishDrag(offset.x);
        }}
        className={`relative w-full max-w-md rounded-3xl shadow-xl overflow-hidden page-card ${
          preview ? "pointer-events-none shadow-md" : ""
        }`}
        style={cardStyle}
      >
        <div className="relative h-72 sm:h-80 w-full bg-base-300">
          <img
            src={user?.photo}
            alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-content/80 via-base-content/20 to-transparent" />

          <div className="absolute left-4 top-4 badge badge-neutral badge-lg gap-1 font-medium">
            {user?.age || "—"}
            {user?.gender && <span className="opacity-80">· {user.gender}</span>}
          </div>

          <div className="absolute left-4 right-4 bottom-4 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
              {user?.firstName} {user?.lastName}
            </h3>
            {user?.location && (
              <p className="text-sm opacity-90 mt-0.5">{user.location}</p>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6 flex flex-col gap-4 bg-base-100">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
              About
            </h4>
            <p className="mt-2 text-base-content/80 text-sm sm:text-base leading-relaxed">
              {user?.about || "No description yet."}
            </p>
          </div>

          {!preview && (
            <>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => animateSwipe("left")}
                  className="btn btn-error btn-outline flex-1 rounded-2xl"
                >
                  Pass
                </button>
                <button
                  type="button"
                  onClick={() => animateSwipe("right")}
                  className="btn btn-success flex-1 rounded-2xl"
                >
                  Connect
                </button>
              </div>
              <p className="text-center text-xs text-base-content/40">
                Swipe or use ← → keys
              </p>
            </>
          )}
        </div>

        {indicatorVisible && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-3xl bg-base-content/20"
            style={{ opacity: Math.min(0.95, indicatorProgress * 1.2) }}
          >
            <div className="flex flex-col items-center text-center text-primary-content">
              <div className="text-5xl select-none">{isRight ? "🤝" : "✕"}</div>
              <div className="mt-2 text-lg font-bold">
                {isRight ? "Connect" : "Pass"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
