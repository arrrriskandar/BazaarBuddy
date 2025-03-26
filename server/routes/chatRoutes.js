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

router.route("/:userId").get(getUserChatsController);
router.route("/:chatId/messages").get(getChatMessagesController);
router.route("/").post(getOrCreateChatController);
router.route("/message").post(sendMessageController);
router.route("/:chatId/read").put(markMessagesAsReadController);
router.route("/:chatId").delete(deleteChatController);

export default router;
