import {
  createProduct,
  deleteProduct,
  getProduct,
  getBrowseProducts,
  getMyProducts,
  updateProduct,
} from "../services/productService.js";

export const createProductController = async (req, res) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductController = async (req, res) => {
  try {
    const product = await getProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBrowseProductsController = async (req, res) => {
  try {
    const products = await getBrowseProducts(req.params.userId, req.query);
    if (!products) {
      return res.status(404).json({ message: "No Products found" });
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyProductsController = async (req, res) => {
  try {
    const products = await getMyProducts(req.params.userId, req.query);
    if (!products) {
      return res.status(404).json({ message: "No Products found" });
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const updatedProduct = await updateProduct(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const deletedProduct = await deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
