import React, { useState, useEffect } from "react";
import moment from "moment";

const Dashboard = ({ setIsAuthenticated }) => {
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editPostData, setEditPostData] = useState(null); // State to store the post being edited

    // Fetch posts data from the API
    async function getPosts() {
        try {
            const response = await fetch("http://localhost:4000/dashboard/posts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setPosts(
                data.sort((a, b) =>
                    new Date(b.create_date) - new Date(a.create_date)
                )
            );
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    // Fetch user data from the API
    async function getUser() {
        try {
            const response = await fetch("http://localhost:4000/dashboard/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }

    // Fetch both user and posts on component mount
    useEffect(() => {
        getPosts();
        getUser();
    }, [posts]);

    // Handle form submission for creating a new post
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const title = e.target[0].value;
        const content = e.target[1].value;

        try {
            const response = await fetch("http://localhost:4000/dashboard/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ title, content }),
            });

            const data = await response.json();
            setPosts((prevPosts) => [...prevPosts, data]);
        } catch (err) {
            console.error("Error creating post:", err);
        }

        e.target.reset();
        setIsModalOpen(false);
    };

    // Handle edit post
    const handleEditPost = async (post_id, title, content) => {
        try {
            const response = await fetch(`http://localhost:4000/dashboard/posts/${post_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ title, content }),
            });

            if (response.ok) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.post_id === post_id ? { ...post, post_title: title, post_content: content } : post
                    )
                );
            }
        } catch (err) {
            console.error("Error editing post:", err);
        }

        setIsEditModalOpen(false);
    };

    // Handle delete post
    const handleDeletePost = async (post_id) => {
        try {
            const response = await fetch(`http://localhost:4000/dashboard/posts/${post_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== post_id));
            }
        } catch (err) {
            console.error("Error deleting post:", err);
        }
    };

    return (
        <div className="container">
            <h1>Hello {user.user_name}</h1>
            <h3>All Posts</h3>
            {posts && posts.map((post) => (
                <div key={post.post_id} className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{post.post_title}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{'created by ' + post.user_name}</h6>
                        <p className="card-text">{post.post_content}</p>
                        <p className="card-text">
                            <small className="text-muted">
                                {moment(post.create_date).format("MMMM Do YYYY, h:mm:ss a")}
                            </small>
                        </p>

                        {/* Show edit and delete buttons only if the user owns the post */}
                        {post.user_id === user.user_id && (
                            <div>
                                <button
                                    className="btn btn-primary me-2"
                                    onClick={() => {
                                        setEditPostData(post);
                                        setIsEditModalOpen(true);
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeletePost(post.post_id)}
                                >
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Button to open modal */}
            <button
                type="button"
                className="btn btn-primary m-2"
                onClick={() => setIsModalOpen(true)}
            >Create Post</button>

            {/* Modal for creating a new post */}
            {isModalOpen && (
                <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Create Post</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setIsModalOpen(false)} 
                                    aria-label="Close">
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleFormSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="title">Title</label>
                                        <input className="form-control" type="text" id="title" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="content">Content</label>
                                        <textarea className="form-control" id="content" required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Post</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit post modal */}
            {isEditModalOpen && editPostData && (
                <div className="modal fade show" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true" style={{ display: "block" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editModalLabel">Edit Post</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setIsEditModalOpen(false)} 
                                    aria-label="Close">
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const title = e.target[0].value;
                                    const content = e.target[1].value;
                                    handleEditPost(editPostData.post_id, title, content);
                                }}>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="title">Title</label>
                                        <input className="form-control" type="text" id="title" defaultValue={editPostData.post_title} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="content">Content</label>
                                        <textarea className="form-control" id="content" defaultValue={editPostData.post_content} required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Edit Post</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout button */}
            <button
                className="btn btn-primary m-2"
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                    setIsAuthenticated(false);
                }}
            >Logout</button>
        </div>
    );
};

export default Dashboard;

