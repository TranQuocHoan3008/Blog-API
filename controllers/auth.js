const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.postSignUp = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      return res
        .status(422)
        .json({ message: "Email is used, please choose another one" });
    }

    if (!validationResult(req).isEmpty()) {
      return res.status(422).json({
        message: "Validation error",
        errors: validationResult(req).array(),
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User({
      username: name,
      email: email,
      password: hashPassword,
    });
    const result = await user.save();
    res.status(201).json({
      message: "create new user successfully",
      userId: result._id,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = "server error";
    }
    throw error;
  }
};

exports.postLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!validationResult(req).isEmpty()) {
      return res.status(422).json({
        message: "Validation error",
        errors: validationResult(req).array(),
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.status(200).json({
        message: "Login successfuly",
        user: {
          name: user.username,
          email: user.email,
          posts: user.posts || [],
          status: user.status || "",
          userId: user._id,
        },
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = "server error";
    }
    throw error;
  }
};
