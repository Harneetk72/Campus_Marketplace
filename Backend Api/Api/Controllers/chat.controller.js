import Chat from "../Model/chat.model.js";
import { Auth } from "../Model/Auth.schema.js";

// GET CHAT
export const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const roomId = [senderId, receiverId]
      .sort()
      .join("-");

    const chat = await Chat.findOne({ roomId });

    if (!chat) {
      return res.status(200).json({
        messages: [],
      });
    }

    // Messages ko read mark karo
    chat.messages.forEach((msg) => {
      if (
        msg.receiverId === senderId &&
        !msg.isRead
      ) {
        msg.isRead = true;
      }
    });

    await chat.save();

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// SAVE MESSAGE
export const saveMessage = async (req, res) => {
  try {
    const {
      roomId,
      senderId,
      receiverId,
      senderName,
      message,
      createdAt,
    } = req.body;

    let chat = await Chat.findOne({ roomId });

    const newMessage = {
      senderId,
      receiverId,
      senderName,
      message,
      createdAt,
      isRead: false,
    };

    if (!chat) {
      chat = await Chat.create({
        roomId,
        messages: [newMessage],
      });
    } else {
      chat.messages.push(newMessage);
      await chat.save();
    }

    res.status(201).json(chat);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// GET MY CONVERSATIONS
export const getMyConversations = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({
      roomId: { $regex: userId },
    });

    const conversations = await Promise.all(
      chats.map(async (chat) => {
        const lastMessage =
          chat.messages[
            chat.messages.length - 1
          ];

        const otherUserId = chat.roomId
          .split("-")
          .find((id) => id !== userId);

        const otherUser =
          await Auth.findById(otherUserId);
          console.log("otherUserId:", otherUserId);
console.log("otherUser:", otherUser);

        const unreadCount = chat.messages.filter(
          (msg) =>
            msg.receiverId === userId &&
            !msg.isRead
        ).length;

        return {
          sellerId: otherUserId,

          sellerName:
            otherUser?.userName || "User",

          lastMessage:
            lastMessage?.message || "",

          lastMessageTime:
            lastMessage?.createdAt || "",

          unreadCount,
        };
      })
    );

    res.status(200).json({
      conversations,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};  