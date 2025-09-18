// controllers/postController.js
const Post = require("../models/Post");
const User = require("../models/User");

// @desc    Create a new post
exports.createPost = async (req, res) => {
  const { content } = req.body;
  try {
    let newPost = new Post({
      content,
      author: req.user.id,
    });
    await newPost.save();
    
    // Populate the author field before sending the response
    newPost = await newPost.populate('author', 'username');
    res.json(newPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username'
        }
      })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Update a post
exports.updatePost = async (req, res) => {
  const { content } = req.body;
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check user
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    post.content = content;
    await post.save();
    
    // Populate both the author and nested comment users
    post = await Post.populate(post, [
      { path: 'author', select: 'username' },
      {
        path: 'comments.user',
        select: 'username'
      }
    ]);
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check user
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.deleteOne(); // Use deleteOne()
    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Like or unlike a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked by this user
    if (post.likes.some((like) => like.toString() === req.user.id)) {
      // Unlike the post
      post.likes = post.likes.filter((like) => like.toString() !== req.user.id);
    } else {
      // Like the post
      post.likes.unshift(req.user.id);
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const newComment = {
      text: req.body.text,
      user: req.user.id,
    };
    post.comments.unshift(newComment);
    await post.save();
    
    // Populate the user within the comments before sending back
    const updatedPost = await Post.findById(post._id)
      .populate({
        path: 'comments.user',
        select: 'username'
      });
      
    res.json(updatedPost.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
