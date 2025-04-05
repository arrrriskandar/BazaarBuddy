import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      required: true,
    },
    unitNumber: {
      type: String,
      required: true,
    },
    ratingTotal: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    stripeId: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.model("UserModel", UserSchema);
