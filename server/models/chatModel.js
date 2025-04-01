import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    sender: {
      type: String,
      ref: "UserModel",
      required: true,
    },
    receiver: {
      type: String,
      ref: "UserModel",
      required: true,
    },
    content: { type: String, required: true },
    isImage: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ChatSchema = new Schema(
  {
    participants: [{ type: String, ref: "UserModel" }],
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("ChatModel", ChatSchema);
