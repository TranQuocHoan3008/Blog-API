const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feed");

const router = express.Router();

// GET /feed/posts
router.get("/posts", feedController.getPosts);

// POST /feed/post
router.post(
  "/post",
  [
    body("title").isString().trim().isLength({ min: 5 }),
    body("content").isString().trim().isLength({ min: 10 }),
  ],
  feedController.createPost
);

router.get("/post/:postId", feedController.getPost);

router.delete("/post/delete-post/:postId", feedController.deletePost);

router.put(
  "/post/edit-post/:postId",
  [
    body("title").isString().trim().isLength({ min: 5 }),
    body("content").isString().trim().isLength({ min: 10 }),
  ],
  feedController.editPost
);

module.exports = router;
