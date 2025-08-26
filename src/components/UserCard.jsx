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

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);

  const cardStyle = {
    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 10 : 1,
  };

  const getSwipeIndicator = () => {
    if (Math.abs(dragOffset.x) < 50) return null;
    
    const isRightSwipe = dragOffset.x > 0;
    const opacity = Math.min(Math.abs(dragOffset.x) / 200, 1);
    
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center text-4xl font-bold rounded-lg ${
          isRightSwipe 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}
        style={{ opacity }}
      >
        {isRightSwipe ? '❤️ Interested' : '❌ Ignore'}
      </div>
    );
  };

  return (
    <div className="relative">
      {getSwipeIndicator()}
      <div 
        ref={cardRef}
        className="card bg-base-300 w-[370px] h-[520px] shadow-xl rounded-3xl flex flex-col overflow-hidden border border-gray-200"
        style={cardStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <figure className="h-64">
          <img
            src={user?.photo}
            alt="Shoes"
            className="w-full h-full object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {user?.firstName} {user?.lastName}
          </h2>
          <p>
            {user?.age && user?.gender && (
              <>
                {user.age}, {user.gender}
              </>
            )}
          </p>
          <p>
            {user?.about} 
          </p>
          <div className="card-actions justify-end">
            <div className="flex justify-center gap-4 w-full mt-2">
              <button
                className="btn btn-primary mx-2"
                onClick={() => handleSendRequest("Ignored", user._id)}
              >
                Ignore
              </button>
              <button
                className="btn btn-secondary mx-2"
                onClick={() => handleSendRequest("Interested", user._id)}
              >
                Interested
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
