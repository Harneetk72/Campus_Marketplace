import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";
import apiClient from "../api/ApiClient.js";
import socket from "../socket";

const Chats = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch conversations
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);

        const res = await apiClient.get(
          `/chat/my-conversations/list/${currentUser._id}`
        );

        console.log("Conversations API:", res.data);

        setChats(res.data.conversations || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load conversations");
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchChats();
    }
  }, [currentUser?._id]);

  // Open chat
  const handleChatClick = (sellerId, sellerName) => {
    console.log("Opening chat with:", sellerId, sellerName);
    setChats((prev) =>
      prev.map((chat) =>      
        chat.sellerId === sellerId
          ? { ...chat, unreadCount: 0 }
          : chat
      )
    );

    navigate(`/chat/${sellerId}`, {
      state: {
        seller: {
          _id: sellerId,
          userName: sellerName,
        },
        sellerName,
      },
    });
  };

  // Listen for new messages
  useEffect(() => {
    const handler = (data) => {
      setChats((prev) => {
        const existingChat = prev.find(
          (c) =>
            c.sellerId === data.senderId ||
            c.sellerId === data.receiverId
        );

        if (!existingChat) return prev;

        return [
          {
            ...existingChat,
            lastMessage: data.message,
            lastMessageTime: new Date(),
          },
          ...prev.filter(
            (c) =>
              c.sellerId !== data.senderId &&
              c.sellerId !== data.receiverId
          ),
        ];
      });
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
          color: "white",
        }}
      >
        <p>Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="chats-container">
      <div className="chats-header">
        <h1>Messages</h1>
        <p className="chats-subtitle">
          {chats.length} conversation
          {chats.length !== 1 ? "s" : ""}
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {chats.length === 0 ? (
        <div className="no-chats">
          <div className="no-chats-icon">💬</div>

          <h2>No conversations yet</h2>

          <p>
            Start chatting with sellers from their
            product listings
          </p>

          <button
            onClick={() => navigate("/products")}
            className="browse-btn"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.sellerId}
              className="chat-item"
              onClick={() =>
                handleChatClick(
                  chat.sellerId,
                  chat.sellerName
                )
              }
            >
            <div
  className="chat-header-row"
  style={{
    display: "flex",
    alignItems: "center",
    width: "100%",
  }}
>
  {/* Seller Name */}
  <h3
    className="chat-name"
    style={{
      minWidth: "120px",
      margin: 0,
    }}
  >
    {chat.sellerName}
  </h3>

  {/* Time + Notification Right */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      minWidth: "90px",
      justifyContent: "flex-end",
    }}
  >
    <span className="chat-time">
      {chat.lastMessageTime
        ? new Date(chat.lastMessageTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""}
    </span>

    {chat.unreadCount > 0 && (
      <span
        style={{
          background: "red",
          color: "#fff",
          borderRadius: "50%",
          width: "22px",
          height: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {chat.unreadCount}
      </span>
    )}
  </div>
</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chats;