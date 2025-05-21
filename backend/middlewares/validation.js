const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const userValidationRules = () => {
  return [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

const parkingValidationRules = () => {
  return [
    body("code").trim().notEmpty().withMessage("Parking code is required"),
    body("name").trim().notEmpty().withMessage("Parking name is required"),
    body("availableSpaces")
      .isInt({ min: 0 })
      .withMessage("Available spaces must be a positive number"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("feePerHour")
      .isFloat({ min: 0 })
      .withMessage("Fee per hour must be a positive number"),
  ];
};

const carValidationRules = () => {
  return [
    body("plateNumber")
      .trim()
      .notEmpty()
      .withMessage("Plate number is required"),
    body("parkingCode")
      .trim()
      .notEmpty()
      .withMessage("Parking code is required"),
  ];
};

module.exports = {
  validate,
  userValidationRules,
  parkingValidationRules,
  carValidationRules,
};
