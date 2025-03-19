import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  unitNumber: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  ratingTotal: {
    type: Number,
    default: 0,
    required: true,
  },
  ratingCount: {
    type: Number,
    default: 0,
    required: true,
  },
});

export default mongoose.model("UserModel", UserSchema);
