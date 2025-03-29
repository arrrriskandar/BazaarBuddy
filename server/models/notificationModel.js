import mongoose from "mongoose";

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "UserModel",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "OrderModel",
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    orderCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("NotificationModel", NotificationSchema);
