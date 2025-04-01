import ChatModel from "../models/chatModel.js";

export const getUserChats = async (userId) => {
  const chats = await ChatModel.find({ participants: userId }).populate(
    "participants",
    "_id username photoUrl"
  );

  const transformedChats = chats.map((chat) => {
    const otherParticipant = chat.participants.find(
      (participant) => participant._id.toString() !== userId
    );

    const lastMessage = chat.messages.length
      ? chat.messages[chat.messages.length - 1]
      : null;

    const { participants, ...rest } = chat.toObject();
    return {
      ...rest,
      otherParticipant,
      lastMessage: lastMessage ? lastMessage.content : null,
      lastMessageAt: lastMessage ? lastMessage.createdAt : null,
      lastMessageRead: lastMessage
        ? lastMessage.sender.toString() === userId || lastMessage.isRead
        : false,
    };
  });

  return transformedChats;
};

export const getChatMessages = async (chatParams) => {
  const { chatId, userId } = chatParams;
  const chat = await ChatModel.findById(chatId)
    .populate("participants", "username photoUrl")
    .select("messages participants");

  if (!chat) throw new Error("Chat not found");

  chat.messages.forEach((msg) => {
    if (msg.receiver.toString() === userId && !msg.isRead) {
      msg.isRead = true;
    }
  });

  await chat.save();

  return chat.messages;
};

export const getOrCreateChat = async (chatData) => {
  const { senderId, receiverId } = chatData;
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

export const sendMessage = async (messageData) => {
  const { chatId, senderId, content, receiverId, isImage } = messageData;
  const chat = await ChatModel.findById(chatId);
  if (!chat) throw new Error("Chat not found");

  const message = { sender: senderId, receiver: receiverId, content, isImage };
  chat.messages.push(message);

  chat.lastMessage = isImage ? "📷 Image" : content;
  chat.lastMessageAt = new Date();

  await chat.save();
  return chat.messages[chat.messages.length - 1].toObject();
};

export const deleteChat = async (chatId) => {
  return await ChatModel.findByIdAndDelete(chatId);
};
