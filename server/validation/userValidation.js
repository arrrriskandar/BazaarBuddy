import { body, validationResult } from "express-validator";

export const createUserValidationRules = () => {
  return [
    body("_id").notEmpty().withMessage("id is required"),
    body("email").isEmail().withMessage("Email is invalid"),
    body("username").notEmpty().withMessage("Username is required"),
  ];
};

export const updateUserValidationRules = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("username").optional().notEmpty().withMessage("Username is required"),
  ];
};

export const restrictedFieldsValidationRules = () => {
  return [
    body("createdAt").not().exists(),
    body("ratingAverage").not().exists(),
    body("ratingCount").not().exists(),
  ].map((rule) => rule.withMessage("Restricted request"));
};

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
