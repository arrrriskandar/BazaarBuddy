import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  user: {
    type: String,
    ref: "UserModel",
    required: true,
  },
  seller: {
    type: String,
    ref: "UserModel",
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "ProductModel",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  updatedAt: { type: Date, default: Date.now, required: true },
});

export default mongoose.model("CartModel", CartSchema);
