import express from "express";
import {
  createCartController,
  getCartController,
  getCartsController,
  updateCartController,
  deleteCartController,
} from "../controllers/cartController.js";

import {
  createCartValidationRules,
  updateCartValidationRules,
  validate,
  checkValidUserId,
  checkValidProductId,
} from "../validation/cartValidation.js";

const router = express.Router();

router
  .route("/")
  .post(
    createCartValidationRules(),
    validate,
    checkValidUserId,
    checkValidProductId,
    createCartController
  );
router.route("/user/:userId").get(getCartsController);
router.route("/:id").get(getCartController);
router
  .route("/:id")
  .put(updateCartValidationRules(), validate, updateCartController);
router.route("/:id").delete(deleteCartController);

export default router;
