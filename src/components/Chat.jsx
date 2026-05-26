import { useLocation, useParams, Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { selectUser } from "../api/userSlice";

const Chat = () => {
  const location = useLocation();
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const user = useSelector(selectUser);
  const userId = user?._id;

  const partnerName = [
    location?.state?.firstName,
    location?.state?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", ({ firstName, text }) => {
      setMessages((prev) => [...prev, { firstName, text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user?.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 page-card overflow-hidden shadow-md">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-base-300 bg-base-100 shrink-0">
        <Link
          to="/connections"
          className="btn btn-ghost btn-sm btn-circle"
          aria-label="Back to connections"
        >
          <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content rounded-full w-10">
            <span className="text-sm font-semibold">
              {location?.state?.firstName?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold truncate">
            {partnerName || "Chat"}
          </h2>
          <p className="text-xs text-success">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 bg-base-200/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-base-content/50 py-12">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-sm">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.firstName === user?.firstName;
            return (
              <div
                key={index}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                    isOwn
                      ? "bg-primary text-primary-content rounded-br-md"
                      : "bg-base-100 text-base-content border border-base-300 rounded-bl-md"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 sm:p-4 border-t border-base-300 bg-base-100 shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message…"
            className="textarea textarea-bordered flex-1 min-h-10 max-h-28 resize-none text-base"
            rows={1}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="btn btn-primary shrink-0"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
