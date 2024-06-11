import { body, validationResult } from "express-validator";
import { getProduct } from "../services/productService.js";
import { getUser } from "../services/userService.js";
import { getCart } from "../services/cartService.js";

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

export const updateQuantityValidationRules = () => {
  return [
    body("quantity").isNumeric().withMessage("Quantity must be a number"),
    body("product").notEmpty().withMessage("Product ID is required"),
  ];
};

export const removeItemValidationRules = () => {
  return [body("product").notEmpty().withMessage("Product ID is required")];
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

export const checkProductExistInCart = async (req, res, next) => {
  try {
    const cart = await getCart(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    if (!req.body.quantity && cart.items.length === 1) {
      return res.status(404).json({
        message:
          "You cannot remove the last item in the cart. Please delete instead.",
      });
    }
    const item = cart.items.find((item) =>
      item.product.equals(req.body.product)
    );
    if (!item) {
      return res
        .status(404)
        .json({ message: "Product does not exist in cart" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
