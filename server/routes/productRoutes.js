import express from "express";
import {
  createProductController,
  getProductController,
  getBrowseProductsController,
  getMyProductsController,
  updateProductController,
  deleteProductController,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/").post(createProductController);
router.route("/buy").get(getBrowseProductsController);
router.route("/sell").get(getMyProductsController);
router.route("/:id").get(getProductController);
router.route("/:id").put(updateProductController);
router.route("/:id").delete(deleteProductController);

export default router;
