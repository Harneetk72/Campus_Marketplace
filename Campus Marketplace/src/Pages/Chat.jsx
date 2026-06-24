import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import socket from "../socket";
import { useAuth } from "../Context/AuthContext";
import apiClient from "../api/ApiClient";

const Chat = () => {
  const { id: sellerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useAuth();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  // ROOM ID
  const roomId = [currentUser?._id, sellerId].sort().join("-");

  // 🚀 FETCH SELLER INFO & CHAT HISTORY
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);

        // SELLER DATA
        const sellerFromState =
          location.state?.seller ||
          (location.state?.sellerName
            ? { userName: location.state.sellerName }
            : null);

        if (sellerFromState) {
          setSeller({
            ...sellerFromState,
            name:
              sellerFromState.name ||
              sellerFromState.userName ||
              sellerFromState.Username ||
              "Seller",
          });
        } else {
          try {
            const sellerRes = await apiClient.get(`/users/${sellerId}`);

            const fetchedSeller = sellerRes.data.user || sellerRes.data;

            setSeller({
              ...fetchedSeller,
              name:
                fetchedSeller.userName ||
                fetchedSeller.name ||
                fetchedSeller.Username ||
                "User",
            });
          } catch (err) {
            console.log("Seller fetch error:", err);

            setSeller({
              _id: sellerId,
              name: location.state?.sellerName || "Seller",
              avatar: "S",
            });
          }
        }

        // CHAT HISTORY
        try {
          const chatRes = await apiClient.get(
            `/chat/${currentUser._id}/${sellerId}`,
          );
          console.log("Chat API Response:", chatRes.data);

          setMessages(chatRes.data.messages || []);
          
        } catch (err) {
          console.log("Chat fetch error:", err);
          setMessages([]);
        }

        setError(null);
      } catch (err) {
        console.log("Error fetching chat data:", err);

        setError("Failed to load chat");

        setSeller({
          _id: sellerId,
          name: location.state?.sellerName || "Seller",
          avatar: "S",
        });
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id && sellerId) {
      fetchChatData();
    }
  }, [
    sellerId,
    currentUser?._id,
    roomId,
    location.state?.seller,
    location.state?.sellerName,
  ]);

  // 🚀 JOIN ROOM
  useEffect(() => {
    if (!roomId || !currentUser?._id) return;

    socket.emit("join_room", {
      roomId,
      userId: currentUser._id,
      userName: currentUser.userName || currentUser.name || "User",
    });

    return () => {
      socket.emit("leave_room", roomId);
    };
  }, [roomId, currentUser?._id]);

  // 🚀 RECEIVE MESSAGE
  useEffect(() => {
    const handler = (data) => {
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);

        saveMessageToBackend(data);
      }
    };

    socket.on("receive_message", handler);

    return () => socket.off("receive_message", handler);
  }, [roomId]);

  // 🚀 AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // 🚀 SAVE MESSAGE TO BACKEND
  const saveMessageToBackend = async (messageData) => {
    try {
      await apiClient.post("/chat/save-message", {
        roomId,
        ...messageData,
      });
    } catch (err) {
      console.log("Error saving message:", err);
    }
  };

  // 🚀 SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim() || !seller || !currentUser) return;

    const messageData = {
      roomId,
      senderId: currentUser._id,
      senderName: currentUser.userName || currentUser.name || "User",
      receiverId: seller._id,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    socket.emit("send_message", messageData);

    setMessages((prev) => [...prev, messageData]);

    setMessage("");
  };

  // ENTER KEY
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // LOADING
  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
          color: "white",
        }}
      >
        <p>Loading chat...</p>
      </div>
    );
  }

  // ERROR
  if (error && !seller) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
          color: "red",
        }}
      >
        <p>{error}</p>

        <button onClick={() => navigate("/chats")}>Back to Chats</button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* HEADER */}
      <div className="chat-header-main">
        <button className="back-btn" onClick={() => navigate("/chats")}>
          ← Back
        </button>

        <div className="chat-header-info">
          <div className="chat-avatar">{seller?.name?.[0] || "S"}</div>

          <div>
            <h2>{seller?.name || "Seller"}</h2>

            <p className="seller-badge">@{seller?.userName || seller?.name}</p>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>Start a conversation with {seller?.name || "this seller"}</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.senderId === currentUser._id ? "own" : "other"
              }`}
            >
              <div className="message-content">
                <p className="message-text">{msg.message}</p>

                <span className="message-time">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            </div>
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input-container">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="chat-input"
        />

        <button onClick={sendMessage} className="send-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
