import { body, validationResult } from "express-validator";
import { getProduct } from "../services/productService.js";
import { getUser } from "../services/userService.js";

export const createCartValidationRules = () => {
  return [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("quantity").isNumeric().withMessage("Quantity must be a number"),
    body("productId").notEmpty().withMessage("Product ID is required"),
    body("updatedAt").not().exists().withMessage("Restricted request"),
  ];
};

export const updateCartValidationRules = () => {
  return [
    body("userId").not().exists().withMessage("User ID cannot be updated"),
    body("productId")
      .not()
      .exists()
      .withMessage("Product ID cannot be updated"),
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

export const checkValidUserId = async (req, res, next) => {
  try {
    const user = await getUser(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: "User ID is not valid" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkValidProductId = async (req, res, next) => {
  try {
    const product = await getProduct(req.body.productId);
    if (!product) {
      return res.status(404).json({ message: "Product ID is not valid" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
