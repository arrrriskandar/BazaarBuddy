import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  authId: {
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
});

export default mongoose.model("UserModel", UserSchema);
