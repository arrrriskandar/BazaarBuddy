import express from "express";
import {
  addToCartController,
  getCartController,
  getCartsController,
  updateCartItemQuantityController,
  deleteCartController,
} from "../controllers/cartController.js";

import {
  createCartValidationRules,
  updateCartValidationRules,
  validate,
  checkValidIds,
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
  .route("/:id")
  .put(updateCartValidationRules(), validate, updateCartItemQuantityController);
router.route("/:id").delete(deleteCartController);

export default router;
