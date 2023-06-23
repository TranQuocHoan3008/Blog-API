const { validationResult } = require("express-validator");
const Post = require("../models/post");
const { v4: uuidv4 } = require("uuid");
const fileHelper = require("../util/file");
const User = require("../models/user");

exports.getPosts = async (req, res, next) => {
  try {
    const curPage = req.query.page || 1;
    const countPosts = await Post.count();

    const posts = await Post.find()
      .skip((curPage - 1) * 2)
      .limit(2);
    res.status(200).json({
      posts: posts,
      totalPosts: countPosts,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.message = "Server error";
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const title = req.body.title;
    const content = req.body.content;

    const resultValidate = validationResult(req);
    if (!resultValidate.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      throw error;
    }
    if (!req.file) {
      const error = new Error("no image found");
      error.statusCode = 422;
      throw error;
    }
    const imageUrl = req.file.path.replaceAll("\\", "/");
    // Create post in db
    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: req.userId,
    });
    await post.save();

    const user = await User.findOne({ _id: req.userId });
    user.posts.push(post);
    await user.save();
    res.status(201).json({
      message: "Post created successfully!",
      post: {
        id: new Date(),
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId,
        createAt: new Date(),
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.message = "Server error";
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPost = async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(422).json({ message: "post not found" });
  }
  res.status(200).json({
    message: "Find post successfully",
    post: post,
  });
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne({ _id: postId });
    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }
    await fileHelper.deleteFile(post.imageUrl);
    await Post.deleteOne({ _id: postId });
    res.status(200).json({ message: "Post is Deleted" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = "server error";
    }
    next(error);
  }
};

exports.editPost = async (req, res, next) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    const creator = req.body.creator;
    const postId = req.params.postId;

    const resultValidate = validationResult(req);
    if (!resultValidate.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      throw error;
    }
    if (creator.toString() !== req.userId) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }
    const post = await Post.findOne({ _id: postId });
    await fileHelper.deleteFile(post.imageUrl);
    if (!req.file) {
      const error = new Error("no image found");
      error.statusCode = 422;
      throw error;
    }
    const imageUrl = req.file.path.replaceAll("\\", "/");

    await fileHelper.deleteFile(post.imageUrl);
    post.title = title;
    post.content = content;
    post.creator = creator;
    post.imageUrl = imageUrl;

    await post.save();
    res.status(201).json({
      message: "Update successfully",
      post: {
        title: post.title,
        content: post.content,
        creator: post.creator,
        imageUrl: post.imageUrl,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = "server error";
      throw next(error);
    }
    throw next(error);
  }
};
