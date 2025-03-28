import ChatModel from "../models/chatModel.js";

export const getUserChats = async (userId) => {
  // Fetch chats and populate participants
  const chats = await ChatModel.find({ participants: userId }).populate(
    "participants",
    "_id username photoUrl"
  );

  // Transform each chat to include the other participant and omit the participants array
  const transformedChats = chats.map((chat) => {
    // Find the other participant (i.e., the one who is not the current user)
    const otherParticipant = chat.participants.find(
      (participant) => participant._id.toString() !== userId
    );

    // Create a new chat object without the participants array and with the otherParticipant field
    const { participants, ...rest } = chat.toObject(); // Remove the participants array
    return {
      ...rest, // Spread the rest of the fields
      otherParticipant, // Add the other participant's details
    };
  });

  return transformedChats;
};

export const getChatMessages = async (chatParams) => {
  const { chatId, userId } = chatParams;
  const chat = await ChatModel.findById(chatId)
    .populate("participants", "username photoUrl") // Load user details once
    .select("messages participants");

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
