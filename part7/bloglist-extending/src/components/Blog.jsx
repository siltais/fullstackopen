import { useState } from "react";
import { useDispatch } from "react-redux";
import { displayNotification } from "../reducers/notificationReducer";
import { likeBlog, removeBlog } from "../reducers/blogReducer";

const Blog = ({ blog, loggedInUser }) => {
  const dispatch = useDispatch();
  const [blogVisible, setBlogVisible] = useState("");
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const hideWhenVisible = { display: blogVisible ? "none" : "" };
  const showWhenVisible = { display: blogVisible ? "" : "none" };

  const handleAddLike = async (blogToLike) => {
    try {
      const updatedBlog = {
        likes: blogToLike.likes + 1,
        author: blogToLike.author,
        title: blogToLike.title,
        url: blogToLike.url,
        user: blogToLike.user.id,
      };
      await dispatch(likeBlog(blogToLike.id, updatedBlog));
    } catch (exception) {
      console.log(exception);
      dispatch(
        displayNotification(
          "error",
          "Something went wrong! Couldn`t add like to the blog.",
          5,
        ),
      );
    }
  };

  const handleRemoveBlog = async (blogToDelete) => {
    try {
      if (
        window.confirm(
          `Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`,
        )
      ) {
        await dispatch(removeBlog(blogToDelete.id));
      }
    } catch (exception) {
      dispatch(
        displayNotification(
          "error",
          "Something went wrong! Couldn`t delete the blog.",
          5,
        ),
      );
    }
  };

  const displayRemoveButton = (userNameLoggedIn, blog) => {
    if (userNameLoggedIn === blog.user.username) {
      return (
        <div>
          <button onClick={() => handleRemoveBlog(blog)}>Remove</button>
        </div>
      );
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        <span className="blogTitle">
          {blog.title} {blog.author}
        </span>
        <button style={hideWhenVisible} onClick={() => setBlogVisible(true)}>
          view
        </button>
        <button style={showWhenVisible} onClick={() => setBlogVisible(false)}>
          hide
        </button>
        <div className="hiddenInBlog" style={showWhenVisible}>
          <div>{blog.url}</div>
          <div>
            <span>likes {blog.likes}</span>
            <button onClick={() => handleAddLike(blog)}>like</button>
            <br />
          </div>
          {blog.user.name}
          {displayRemoveButton(loggedInUser.username, blog)}
        </div>
      </div>
    </div>
  );
};
export default Blog;
