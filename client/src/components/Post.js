import React, { useState } from "react";

const Post = ({ post, user, onLike, onComment, onDelete, onUpdate }) => {
  const [commentText, setCommentText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post._id, commentText);
    setCommentText("");
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    onUpdate(post._id, editedContent);
    setIsEditing(false);
  };

  // Check if the current user has liked this post
  const isLiked = user && post.likes.includes(user.id);

  // The author ID in the post object might be stored differently, adjust if needed
  // In our case, `post.author` is an object: { _id: '...', username: '...' }
  const isAuthor = user && post.author && user.id === post.author._id;

  return (
    <div className="post">
      <h4 className="post-author">
        {post.author ? post.author.username : "Unknown User"}
      </h4>
      
      {isEditing ? (
        // Edit mode view
        <form onSubmit={handleUpdateSubmit} className="edit-form">
          <textarea
            className="edit-textarea"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            required
          />
          <div className="edit-actions">
            <button type="submit" className="action-btn">Save</button>
            <button 
              type="button" 
              onClick={() => {
                setIsEditing(false);
                setEditedContent(post.content); // Reset to original content on cancel
              }} 
              className="action-btn btn-delete"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        // Normal view
        <>
          <p className="post-content">{post.content}</p>
          <small>Likes: {post.likes.length}</small>
          
          <div className="post-actions">
            <button onClick={() => onLike(post._id)} className="action-btn">
              {isLiked ? "Unlike" : "Like"}
            </button>
            {isAuthor && (
              <>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="action-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(post._id)}
                  className="action-btn btn-delete"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}

      <div className="comment-section">
        <form onSubmit={handleCommentSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </div>
        </form>
        <div className="comments-list">
          {post.comments.map((comment) => (
            <p key={comment._id} className="comment">
              <strong>{comment.user ? comment.user.username : 'User'}:</strong> {comment.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
