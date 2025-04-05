import express from "express";
import { createAccountLinkController } from "../controllers/stripeController.js";

const router = express.Router();

router.route("/create-account-link").post(createAccountLinkController);

export default router;
