import express from "express";
import {
  createUserController,
  deleteUserController,
  getUserController,
  updateUserController,
} from "../controllers/userController.js";
import {
  createUserValidationRules,
  updateUserValidationRules,
  validate,
  restrictedFieldsValidationRules,
} from "../validation/userValidation.js";
const router = express.Router();

router
  .route("/")
  .post(
    createUserValidationRules(),
    restrictedFieldsValidationRules(),
    validate,
    createUserController
  );
router.route("/:id").get(getUserController);
router
  .route("/:id")
  .put(
    updateUserValidationRules(),
    restrictedFieldsValidationRules(),
    validate,
    updateUserController
  );
router.route("/:id").delete(deleteUserController);

export default router;
