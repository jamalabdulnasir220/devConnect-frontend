import { useLocation, useParams } from "react-router";
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    // As soon as the page loads, join the chat
    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", ({ firstName, text }) => {
      setMessages((messages) => [...messages, { firstName, text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      //   const message = {
      //     id: Date.now(),
      //     text: newMessage,
      //     sender: "currentUser", // In a real app, this would be the logged-in user's ID
      //     timestamp: new Date().toLocaleTimeString(),
      //   };
      //   setMessages([...messages, message]);
      //   setNewMessage("");
      const socket = createSocketConnection();
      socket.emit("sendMessage", {
        firstName: user?.firstName,
        userId,
        targetUserId,
        text: newMessage,
      });
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {location?.state?.firstName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Chat with{" "}
              {location?.state?.firstName + " " + location?.state?.lastName}
            </h2>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.firstName === user?.firstName
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.firstName === user?.firstName
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.firstName === user?.firstName
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="1"
              style={{ minHeight: "40px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
