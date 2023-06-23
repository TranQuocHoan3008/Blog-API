const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

// GET /feed/posts
router.get("/posts", isAuth, feedController.getPosts);

// POST /feed/post
router.post(
  "/post",
  [
    body("title").isString().trim().isLength({ min: 5 }),
    body("content").isString().trim().isLength({ min: 10 }),
  ],
  isAuth,
  feedController.createPost
);

router.get("/post/:postId", isAuth, feedController.getPost);

router.delete("/post/delete-post/:postId", isAuth, feedController.deletePost);

router.put(
  "/post/edit-post/:postId",
  [
    body("title").isString().trim().isLength({ min: 5 }),
    body("content").isString().trim().isLength({ min: 10 }),
  ],
  isAuth,
  feedController.editPost
);

module.exports = router;
