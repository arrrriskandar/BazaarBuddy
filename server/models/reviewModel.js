import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  user: {
    type: String,
    ref: "UserModel",
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "ProductModel",
    required: true,
  },
  reviewDate: { type: Date, default: Date.now },
  comment: { type: String, required: true },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

export default mongoose.model("ReviewModel", ReviewSchema);
