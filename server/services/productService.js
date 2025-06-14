import ProductModel from "../models/productModel.js";

export const createProduct = async (productData) => {
  const product = new ProductModel(productData);
  return await product.save();
};

export const getProduct = async (productId) => {
  return await ProductModel.findById(productId);
};

export const getProductsBySeller = async (productId) => {
  const product = await ProductModel.findById(productId).populate({
    path: "seller",
    model: "UserModel",
  });
  const { seller } = product;
  const products = await ProductModel.find({
    seller: seller,
    _id: { $ne: productId },
  }).populate({
    path: "seller",
    model: "UserModel",
  });
  return { product, products };
};

export const getBrowseProducts = async (userId, queryParams) => {
  const { category, name, sortCriteria, page, limit } = queryParams;
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 20;

  let query = {};
  let sortBy;
  let sortOrder;

  query.stock = "Available";
  query.seller = { $ne: userId };

  if (category) {
    query.category = category;
  }
  if (name) query.name = new RegExp(name, "i");

  if (sortCriteria) {
    if (sortCriteria.includes("asc")) {
      sortBy = sortCriteria.slice(0, -3);
      sortOrder = 1;
    } else {
      sortBy = sortCriteria.slice(0, -4);
      sortOrder = -1;
    }
  }

  let sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder;
  }

  const totalProducts = await ProductModel.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / pageSize);

  const products = await ProductModel.find(query)
    .sort(sortOptions)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  return {
    products,
    total: totalProducts,
    totalPages,
    page: pageNumber,
    pageSize,
  };
};

export const getMyProducts = async (userId, queryParams) => {
  const { name } = queryParams;

  let query = {};

  query.seller = userId;

  if (name) query.name = new RegExp(name, "i");

  const sortOptions = { updatedAt: -1 };

  const availabilityQuery = { ...query, stock: "Available" };
  const oOSQuery = { ...query, stock: "Out of Stock" };
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

export const updateProduct = async (productId, productData) => {
  productData.updatedAt = Date.now();
  return await ProductModel.findByIdAndUpdate(productId, productData, {
    new: true,
  });
};

export const deleteProduct = async (productId) => {
  return await ProductModel.findByIdAndDelete(productId);
};
