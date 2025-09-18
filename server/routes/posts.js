// routes/posts.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  likePost,
  addComment,
} = require("../controllers/postController");

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post("/", protect, createPost);

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get("/", getAllPosts);

// @route   PUT api/posts/:id
// @desc    Update a post
// @access  Private
router.put("/:id", protect, updatePost);

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", protect, deletePost);

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put("/like/:id", protect, likePost);

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post("/comment/:id", protect, addComment);

module.exports = router;
