import ChatModel from "../models/chatModel.js";

export const getUserChats = async (userId) => {
  const chat = await ChatModel.find({ participants: userId }).populate(
    "participants",
    "username photoUrl"
  );

  if (!chat) throw new Error("Chat not found");

  // Mark messages as read for the specific user
  chat.messages.forEach((msg) => {
    if (msg.receiver.toString() === userId && !msg.isRead) {
      msg.isRead = true;
    }
  });

  await chat.save(); // Save updated chat with read messages

  return chat.messages;
};

export const getChatMessages = async (chatId) => {
  return await ChatModel.findById(chatId)
    .populate("participants", "username photoUrl") // Load user details once
    .select("messages participants");
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

export const sendMessage = async (
  chatId,
  senderId,
  content,
  receiverId,
  isImage
) => {
  const chat = await ChatModel.findById(chatId);
  if (!chat) throw new Error("Chat not found");

  const message = { sender: senderId, receiver: receiverId, content, isImage };
  chat.messages.push(message);

  chat.lastMessage = isImage ? content : "📷 Image";
  chat.lastMessageAt = new Date();

  await chat.save();
  return message;
};

export const deleteChat = async (chatId) => {
  return await ChatModel.findByIdAndDelete(chatId);
};
