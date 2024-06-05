import { body, validationResult } from "express-validator";
import { stockValues, categoryValues } from "../constants.js";
import { getProduct } from "../services/productService.js";
import { getUser } from "../services/userService.js";

export const createProductValidationRules = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("category")
      .notEmpty()
      .withMessage("Category is required")
      .isIn(categoryValues)
      .withMessage("Invalid category"),
    body("stock")
      .notEmpty()
      .withMessage("Stock is required")
      .isIn(stockValues)
      .withMessage("Invalid stock value"),
  ];
};

export const updateProductValidationRules = () => {
  return [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("price").optional().isNumeric().withMessage("Price must be a number"),
    body("category")
      .optional()
      .isIn(categoryValues)
      .withMessage("Invalid category"),
    body("stock")
      .optional()
      .isIn(stockValues)
      .withMessage("Invalid stock value"),
  ];
};

export const restrictedFieldsValidationRules = () => {
  return [
    body("updatedAt").not().exists(),
    body("createdAt").not().exists(),
    body("ratingAverage").not().exists(),
    body("ratingCount").not().exists(),
  ].map((rule) => rule.withMessage("Restricted request"));
};

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const checkIfDiscontinued = async (req, res, next) => {
  try {
    const product = await getProduct(req.params.id);
    if (product.stock === "Discontinued") {
      return res
        .status(400)
        .json({ message: "Cannot edit a discontinued product" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const validateNoSellerField = (req, res, next) => {
  if ("seller" in req.body) {
    return res.status(400).json({ message: "Seller field cannot be updated" });
  }
  next();
};

export const checkValidSeller = async (req, res, next) => {
  try {
    const user = await getUser(req.body.seller);
    if (!user) {
      return res.status(404).json({ message: "Seller id is not valid" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
