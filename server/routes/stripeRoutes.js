import express from "express";
import {
  createAccountLinkController,
  createStripeCheckoutSessionController,
} from "../controllers/stripeController.js";

const router = express.Router();

router.route("/create-account-link").post(createAccountLinkController);
router.route("/checkout-session").post(createStripeCheckoutSessionController);

export default router;
