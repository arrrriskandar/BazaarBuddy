import {
  getUserChats,
  getChatMessages,
  getOrCreateChat,
  sendMessage,
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
    const messages = await getChatMessages(req.params);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrCreateChatController = async (req, res) => {
  try {
    const chat = await getOrCreateChat(req.body);
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMessageController = async (req, res) => {
  try {
    const message = await sendMessage(req.body);
    res.json(message);
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
