import express from "express";
import {
  createUserController,
  deleteUserController,
  getUserController,
  updateUserController,
} from "../controllers/userController.js";
const router = express.Router();

router.route("/").post(createUserController);
router.route("/:id").get(getUserController);
router.route("/:id").put(updateUserController);
router.route("/:id").delete(deleteUserController);

export default router;
