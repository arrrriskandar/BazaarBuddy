import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  userId: {
    type: String,
    ref: "UserModel",
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "ProductModel",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  updatedAt: { type: Date, default: Date.now, required: true },
});

export default mongoose.model("CartModel", CartSchema);
