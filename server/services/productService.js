import ProductModel from "../models/productModel.js";

export const createProduct = async (productData) => {
  const product = new ProductModel(productData);
  return await product.save();
};

export const getProduct = async (id) => {
  return await ProductModel.findById(id);
};

export const getBrowseProducts = async (userId, queryParams) => {
  const {
    category,
    name,
    sortBy = "ratingAverage",
    sortOrder = "desc",
  } = queryParams;

  let query = {};

  query.stock = "Available";
  query.seller = { $ne: userId };

  if (category && category.length > 0) {
    query.category = { $in: category };
  }
  if (name) query.name = new RegExp(name, "i");

  let sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  }
  return await ProductModel.find(query).sort(sortOptions);
};

export const getMyProducts = async (userId, queryParams) => {
  const { name } = queryParams;

  let query = {};

  query.seller = userId;

  if (name) query.name = new RegExp(name, "i");

  const sortOptions = { updatedAt: -1 };

  const availabilityQuery = { ...query, stock: "Available" };
  const oOSQuery = { ...query, stock: "Out Of Stock" };
  const discontinuedQuery = { ...query, stock: "Discontinued" };

  const availableProducts = await ProductModel.find(availabilityQuery).sort(
    sortOptions
  );
  const oOSProducts = await ProductModel.find(oOSQuery).sort(sortOptions);
  const discontinuedProducts = await ProductModel.find(discontinuedQuery).sort(
    sortOptions
  );

  return {
    available: availableProducts,
    outOfStock: oOSProducts,
    discontinued: discontinuedProducts,
  };
};

export const updateProduct = async (id, productData) => {
  productData.updatedAt = Date.now();
  return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
};

export const deleteProduct = async (id) => {
  return await ProductModel.findByIdAndDelete(id);
};
