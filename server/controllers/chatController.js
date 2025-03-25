import {
  getUserChats,
  getChatMessages,
  getOrCreateChat,
  sendMessage,
  markMessagesAsRead,
  deleteChat,
} from "../services/chatService.js";

export const getUserChatsController = async (req, res) => {
  try {
    const chats = await getUserChats(req.params.userId);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getChatMessagesController = async (req, res) => {
  try {
    const messages = await getChatMessages(req.params.chatId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrCreateChatController = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const chat = await getOrCreateChat(senderId, receiverId);
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMessageController = async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;
    const message = await sendMessage(chatId, senderId, content);
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markMessagesAsReadController = async (req, res) => {
  try {
    const chat = await markMessagesAsRead(req.params.chatId, req.body.userId);
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteChatController = async (req, res) => {
  try {
    await deleteChat(req.params.chatId);
    res.json({ message: "Chat deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
