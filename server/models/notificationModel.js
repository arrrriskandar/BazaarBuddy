import mongoose from "mongoose";

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "UserModel",
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("NotificationModel", NotificationSchema);
