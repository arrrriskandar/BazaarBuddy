import express from "express";
import {
  addToCartController,
  getCartController,
  getCartsController,
  updateCartItemQuantityController,
  deleteCartController,
  removeCartItemController,
} from "../controllers/cartController.js";

import {
  createCartValidationRules,
  updateQuantityValidationRules,
  removeItemValidationRules,
  validate,
  checkValidIds,
  checkProductExistInCart,
} from "../validation/cartValidation.js";

const router = express.Router();

router
  .route("/")
  .post(
    createCartValidationRules(),
    validate,
    checkValidIds,
    addToCartController
  );
router.route("/user/:userId").get(getCartsController);
router.route("/:id").get(getCartController);
router
  .route("/updateQuantity/:id")
  .put(
    updateQuantityValidationRules(),
    validate,
    checkProductExistInCart,
    updateCartItemQuantityController
  );
router
  .route("/removeItem/:id")
  .put(
    removeItemValidationRules(),
    validate,
    checkProductExistInCart,
    removeCartItemController
  );
router.route("/:id").delete(deleteCartController);

export default router;
