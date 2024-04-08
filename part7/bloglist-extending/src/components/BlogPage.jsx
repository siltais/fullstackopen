import { useDispatch, useSelector } from "react-redux";
import { likeBlog, removeBlog } from "../reducers/blogReducer";
import { displayNotification } from "../reducers/notificationReducer";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import Comments from "../components/Comments";

const BlogPage = ({ blog }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login);

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
        navigate("/");
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
        <span>
          <button className="ui button" onClick={() => handleRemoveBlog(blog)}>
            Remove
          </button>
        </span>
      );
    }
  };

  if (!blog) {
    return null;
  }
  return (
    <div className="ui centered">
      <div className="ui card centered">
        <div className="header">
          <h1 className="center aligned">{blog.title}</h1>
        </div>
        <div className="content">
          <a href={blog.url}>{blog.url}</a>
          <div>added by {blog.user.name}</div>
        </div>
        <div className="content">
          <Comments comments={blog.comments} blogId={blog.id} />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div className="ui labeled button">
          <div className="ui red button" onClick={() => handleAddLike(blog)}>
            <i className="heart icon"></i> Like
          </div>
          <a className="ui basic red left pointing label">{blog.likes}</a>
        </div>
        {displayRemoveButton(user.username, blog)}
      </div>
    </div>
  );
};
export default BlogPage;
