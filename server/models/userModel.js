import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    default: "",
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  ratingAverage: {
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
