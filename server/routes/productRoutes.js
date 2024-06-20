import express from "express";
import {
  createProductController,
  getProductsBySellerController,
  getBrowseProductsController,
  getMyProductsController,
  updateProductController,
  deleteProductController,
} from "../controllers/productController.js";

import {
  createProductValidationRules,
  updateProductValidationRules,
  validate,
  checkIfDiscontinued,
  checkValidSeller,
  validateNoSellerField,
  restrictedFieldsValidationRules,
} from "../validation/productValidation.js";

const router = express.Router();

router
  .route("/")
  .post(
    checkValidSeller,
    createProductValidationRules(),
    restrictedFieldsValidationRules(),
    validate,
    createProductController
  );
router.route("/buy/:userId").get(getBrowseProductsController);
router.route("/sell/:userId").get(getMyProductsController);
router.route("/:id").get(getProductsBySellerController);
router
  .route("/:id")
  .put(
    checkIfDiscontinued,
    validateNoSellerField,
    updateProductValidationRules(),
    restrictedFieldsValidationRules(),
    validate,
    updateProductController
  );
router.route("/:id").delete(deleteProductController);

export default router;
