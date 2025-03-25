import ChatModel from "../models/chatModel.js";

export const getUserChats = async (userId) => {
  return await ChatModel.find({ participants: userId }).populate(
    "participants",
    "name email"
  );
};

export const getChatMessages = async (chatId) => {
  return await ChatModel.findById(chatId).populate(
    "messages.sender messages.receiver",
    "name email"
  );
};

export const getOrCreateChat = async (senderId, receiverId) => {
  let chat = await ChatModel.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!chat) {
    chat = new ChatModel({
      participants: [senderId, receiverId],
      messages: [],
    });
    await chat.save();
  }
  return chat;
};

export const sendMessage = async (chatId, senderId, content) => {
  const chat = await ChatModel.findById(chatId);
  if (!chat) throw new Error("Chat not found");

  const message = { sender: senderId, content };
  chat.messages.push(message);
  chat.lastMessage = content;
  chat.lastMessageAt = new Date();
  await chat.save();
  return message;
};

export const markMessagesAsRead = async (chatId, userId) => {
  const chat = await ChatModel.findById(chatId);
  if (!chat) throw new Error("Chat not found");

  chat.messages.forEach((msg) => {
    if (msg.receiver.toString() === userId) msg.isRead = true;
  });

  await chat.save();
  return chat;
};

export const deleteChat = async (chatId) => {
  return await ChatModel.findByIdAndDelete(chatId);
};
