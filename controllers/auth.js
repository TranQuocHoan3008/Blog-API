const { validationResult } = require("express-validator");
const Post = require("../models/post");
const { v4: uuidv4 } = require("uuid");
const fileHelper = require("../util/file");
const post = require("../models/post");

exports.getLogin = (req, res) => {};
