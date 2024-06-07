import express from "express";
import {
  createCartController,
  getCartController,
  getCartsController,
  updateCartController,
  deleteCartController,
} from "../controllers/cartController.js";

const router = express.Router();

router.route("/").post(createCartController);
router.route("/user/:userId").get(getCartsController);
router.route("/:id").get(getCartController);
router.route("/:id").put(updateCartController);
router.route("/:id").delete(deleteCartController);

export default router;
