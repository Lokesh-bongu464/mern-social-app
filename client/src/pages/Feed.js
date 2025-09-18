import React, { useState, useEffect } from "react";
import api from "../api/apiService";
import Post from "../components/Post";

const Feed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts");
      }
    };
    fetchPosts();
  }, []);

  const handlePostCreate = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to create a post.");
      return;
    }
    try {
      const res = await api.post("/posts", { content });
      setPosts([res.data, ...posts]); // Add new post to the top
      setContent("");
    } catch (err) {
      console.error("Error creating post");
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      alert("Please log in to like a post.");
      return;
    }
    try {
      const res = await api.put(`/posts/like/${postId}`);
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, likes: res.data } : post
        )
      );
    } catch (err) {
      console.error("Error liking post");
    }
  };

  const handleComment = async (postId, text) => {
    if (!user) {
      alert("Please log in to comment.");
      return;
    }
    try {
      const res = await api.post(`/posts/comment/${postId}`, { text });
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, comments: res.data } : post
        )
      );
    } catch (err) {
      console.error("Error adding comment");
    }
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Error deleting post");
    }
  };

  const handleUpdate = async (postId, updatedContent) => {
    try {
      const res = await api.put(`/posts/${postId}`, { content: updatedContent });
      setPosts(posts.map(post => post._id === postId ? res.data : post));
    } catch (err) {
      console.error('Error updating post');
    }
  };

  return (
    <div>
      <div className="form-container post-form">
        <h2>Create a Post</h2>
        <form onSubmit={handlePostCreate}>
          <div className="form-group">
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn">
            Post
          </button>
        </form>
      </div>

      <div>
        {posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            user={user}
            onLike={handleLike}
            onComment={handleComment}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;
