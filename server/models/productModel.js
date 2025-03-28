import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    images: {
      type: String,
      default: "",
    },
    seller: {
      type: String,
      ref: "UserModel",
      required: true,
    },
    stock: {
      type: String,
      default: "Available",
    },
    ratingTotal: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    photouuid: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ProductModel", ProductSchema);
