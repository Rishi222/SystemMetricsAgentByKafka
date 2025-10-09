const express = require("express");
const router = express.Router();

// Import controller functions
const { body } = require("express-validator");
const { validate } = require("../middlewares/validators");
const authController = require("../controllers/authController");

// Define routes for authentication
router.post(
  "/signup",
  [
    body("username").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").notEmpty().isIn(["producer", "consumer", "admin"]),
  ],
  validate,
  authController.signup
);

router.post(
  "/login",
  [body("emailOrUsername").notEmpty(), body("password").notEmpty()],
  validate,
  authController.login
);

router.post("/logout", authController.logout);

router.post(
  "/forgot-password",
  [body("email").isEmail()],
  validate,
  authController.forgotPassword
);

router.post(
  "/reset-password",
  [
    body("token").notEmpty(),
    body("id").isInt(),
    body("newPassword").isLength({ min: 6 }),
  ],
  validate,
  authController.resetPassword
);

module.exports = router;