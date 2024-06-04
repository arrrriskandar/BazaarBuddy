import userModel from "./userModel.js";
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
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
    ref: userModel,
    required: true,
  },
  stock: {
    type: String,
    required: true,
    default: "Available",
  },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
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

export default mongoose.model("ProductModel", ProductSchema);
