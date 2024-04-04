import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Notification from "../components/Notification";
import { setUser } from "../reducers/loginReducer";
import Togglable from "../components/Togglable";
import NewBlogForm from "../components/NewBlogForm";
import Blog from "../components/Blog";

const BlogForm = () => {
  const dispatch = useDispatch();
  const blogFormRef = useRef();

  const handleLogout = () => {
    window.localStorage.removeItem("loggedInUser");
    dispatch(setUser(null));
  };

  const user = useSelector((state) => state.login);
  const blogs = useSelector((state) => state.blogs);

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <NewBlogForm />
      </Togglable>
      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} loggedInUser={user} />
        ))}
      </div>
    </div>
  );
};
export default BlogForm;
