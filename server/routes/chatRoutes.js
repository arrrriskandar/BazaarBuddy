import express from "express";
import {
  getUserChatsController,
  getChatMessagesController,
  getOrCreateChatController,
  sendMessageController,
  deleteChatController,
} from "../controllers/chatController.js";

const router = express.Router();

router.route("/:userId").get(getUserChatsController);
router.route("/:chatId/:userId").get(getChatMessagesController);
router.route("/").post(getOrCreateChatController);
router.route("/message").post(sendMessageController);
router.route("/:chatId").delete(deleteChatController);

export default router;
