const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authController = require("../controllers/auth");
const { body } = require("express-validator");

router.post(
  "/login",
  [
    body("email").trim().isEmail(),
    body("password").isString().isLength({ min: 5, max: 15 }),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    body("email").trim().isEmail(),
    body("password").isString().isLength({ min: 5, max: 15 }),
  ],
  authController.postSignUp
);

module.exports = router;
