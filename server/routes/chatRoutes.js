import express from "express";
import {
  getUserChatsController,
  getChatMessagesController,
  getOrCreateChatController,
  sendMessageController,
  markMessagesAsReadController,
  deleteChatController,
} from "../controllers/chatController.js";

const router = express.Router();

router.route("/:userId").get(getUserChatsController); // Get all chats for a user
router.route("/:chatId/messages").get(getChatMessagesController); // Get messages in a chat
router.route("/").post(getOrCreateChatController); // Get or create a chat
router.route("/message").post(sendMessageController); // Send a message
router.route("/:chatId/read").put(markMessagesAsReadController); // Mark messages as read
router.route("/:chatId").delete(deleteChatController); // Delete a chat

export default router;
