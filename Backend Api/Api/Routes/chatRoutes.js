import express from "express";

import {
  getMessages,
  saveMessage,
  getMyConversations,
} from "../Controllers/chat.controller.js";

const router = express.Router();

// GET OLD MESSAGES
router.get(
  "/:senderId/:receiverId",
  getMessages
);

// SAVE MESSAGE
router.post(
  "/save-message",
  saveMessage
);

// GET ALL CONVERSATIONS
router.get(
  "/my-conversations/list/:userId",
  getMyConversations
);

export default router;