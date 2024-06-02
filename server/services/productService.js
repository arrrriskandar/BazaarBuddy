import ProductModel from "../models/productModel.js";

export const createProduct = async (productData) => {
  const product = new ProductModel(productData);
  return await product.save();
};

export const getProduct = async (id) => {
  return await ProductModel.findById(id);
};

export const getBrowseProducts = async (queryParams) => {
  const {
    category,
    name,
    stock,
    sortBy = "updatedAt",
    sortOrder = "desc",
    userId,
    retrieveMyProducts,
  } = queryParams;

  let query = {};

  if (category && category.length > 0) {
    query.category = { $in: category };
  }
  if (name) query.name = new RegExp(name, "i");
  if (stock && stock.length > 0) {
    query.stock = { $in: stock };
  }
  if (userId && retrieveMyProducts === "yes") {
    query.seller = userId;
  } else if (userId && retrieveMyProducts === "no") {
    query.seller = { $ne: userId };
  }

  let sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  }
  return await ProductModel.find(query).sort(sortOptions);
};

export const getMyProducts = async (queryParams) => {
  const { userId } = queryParams;
  console.log(userId);

  let query = {};
  if (userId) query.seller = userId;

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
