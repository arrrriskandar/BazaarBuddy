import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderItemSchema = new Schema(
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
  { _id: false }
);

const OrderSchema = new Schema({
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
  items: [OrderItemSchema],
  orderDate: { type: Date, default: Date.now, required: true },
  totalPrice: { type: Number },
  shippingAddress: { type: String, required: true },
  unitNumber: { type: String, required: true },
  status: { type: String, default: "To Ship" },
});

export default mongoose.model("OrderModel", OrderSchema);
