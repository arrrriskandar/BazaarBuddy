import { body, validationResult } from "express-validator";
import { getProduct } from "../services/productService.js";
import { getUser } from "../services/userService.js";

export const createCartValidationRules = () => {
  return [
    body("user").notEmpty().withMessage("User ID is required"),
    body("quantity").isNumeric().withMessage("Quantity must be a number"),
    body("product").notEmpty().withMessage("Product ID is required"),
    body("updatedAt").not().exists().withMessage("Restricted request"),
    body("seller").notEmpty().withMessage("Seller ID is required"),
    body("seller").custom((value, { req }) => {
      if (value === req.body.user) {
        throw new Error("Seller ID and User ID cannot be the same");
      }
      return true;
    }),
  ];
};

export const updateCartValidationRules = () => {
  return [
    body("user").not().exists().withMessage("User ID cannot be updated"),
    body("product").not().exists().withMessage("Product ID cannot be updated"),
    body("updatedAt").not().exists().withMessage("Restricted request"),
    body("quantity").isNumeric().withMessage("Quantity must be a number"),
  ];
};

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const checkValidIds = async (req, res, next) => {
  try {
    const user = await getUser(req.body.user);
    const seller = await getUser(req.body.user);
    const product = await getProduct(req.body.product);
    if (!user) {
      return res.status(404).json({ message: "User ID is not valid" });
    }
    if (!seller) {
      return res.status(404).json({ message: "Seller ID is not valid" });
    }
    if (!product) {
      return res.status(404).json({ message: "Product ID is not valid" });
    }
    if (product.stock === "Discontinued" || product.stock === "Out of Stock") {
      return res.status(404).json({ message: "Product is not available" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
