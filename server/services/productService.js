import ProductModel from "../models/productModel.js";

export const createProduct = async (productData) => {
  const product = new ProductModel(productData);
  return await product.save();
};

export const getProduct = async (id) => {
  return await ProductModel.findById(id);
};

export const getProducts = async (params) => {
  const {
    category,
    name,
    stock,
    seller,
    sortBy = "updatedAt",
    sortOrder = "desc",
  } = params;
  let query = {};

  if (category) query.category = category;
  if (name) query.name = new RegExp(name, "i");
  if (stock) query.stock = stock;
  if (seller) query.seller = seller;

  let sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  return await ProductModel.find(query).sort(sortOptions);
};

export const updateProduct = async (id, productData) => {
  productData.updatedAt = Date.now();
  return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
};

export const deleteProduct = async (id) => {
  return await ProductModel.findByIdAndDelete(id);
};
