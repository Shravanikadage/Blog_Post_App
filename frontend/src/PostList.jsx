import { useEffect, useState } from "react";
import axios from "axios";
import "./PostList.css";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedPost, setUpdatedPost] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get("https://blog-post-app-backend.vercel.app/api/posts");
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  const handleReadMore = (post) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  };

  const handleShowLess = () => {
    setSelectedPost(null);
    document.body.style.overflow = "auto";
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleUpdate = (post) => {
    setIsEditing(true);
    setUpdatedPost(post);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setUpdatedPost((prevPost) => ({ ...prevPost, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      console.log('Updated post ID:', updatedPost._id);
      const response = await axios.put(`https://blog-post-app-backend.vercel.app/api/posts/${updatedPost._id}`, {
        title: updatedPost.title,
        description: updatedPost.description,
        image: updatedPost.image,
      });
      console.log('Response:', response);
      setPosts(posts.map((post) => (post._id === updatedPost._id ? response.data : post)));
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  return (
    <>
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome to Our Blog</h1>
        <p>Discover inspiring stories, thoughts, and ideas shared by our community!</p>
      </div>

      {/* Post List Section */}
      <div className="post-list-container">
        <div className="post-list">
          {posts.length === 0 ? (
            <p>No posts available.</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="post-card">
                {post.image && (
                  <img src={https://blog-post-app-backend.vercel.app${post.image}`} alt={post.title} className="post-image" />
                )}
                <h3>{post.title}</h3>
                <div className="post-description">
                  {post.description.slice(0, 100)}...{" "}
                </div>
                <a href="#" className="read-more-link" onClick={(e) => { e.preventDefault(); handleReadMore(post); }}>
                  Read More
                </a>
                <div className="post-actions">
                  <button className="update-btn" onClick={() => handleUpdate(post)}>
                    Update
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(post._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Read More Modal */}
        {selectedPost && (
          <div className="modal-overlay" onClick={handleShowLess}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              {selectedPost.image && (
                <img src={`https://blog-post-app-backend.vercel.app${selectedPost.image}`} alt={selectedPost.title} className="modal-image" />
              )}
              <h3>{selectedPost.title}</h3>
              <p>{selectedPost.description}</p>
              <a href="#" className="show-less-link" onClick={(e) => { e.preventDefault(); handleShowLess(); }}>
                Show Less
              </a>
            </div>
          </div>
        )}

        {/* Edit Post Modal */}
        {isEditing && (
          <div className="modal-overlay" onClick={() => setIsEditing(false)}>
            <div className="modal-content-2" onClick={(e) => e.stopPropagation()}>
              <h2>Edit Post</h2>
              <form>
                <label>Title:</label>
                <input type="text" name="title" value={updatedPost.title} onChange={handleEditChange} />
                <br />
                <label>Description:</label>
                <textarea name="description" value={updatedPost.description} onChange={handleEditChange} />
                <br />
                <button onClick={(e) => { e.preventDefault(); handleSaveEdit(); }}>Save Changes</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PostList;
