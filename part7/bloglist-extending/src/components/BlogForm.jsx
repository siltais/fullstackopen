import { useRef } from "react";
import { useSelector } from "react-redux";
import Togglable from "../components/Togglable";
import NewBlogForm from "../components/NewBlogForm";
import Blog from "../components/Blog";

const BlogForm = () => {
  const blogFormRef = useRef();

  const user = useSelector((state) => state.login);
  const blogs = useSelector((state) => state.blogs);

  return (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <NewBlogForm />
      </Togglable>
      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} loggedInUser={user} />
        ))}
      </div>
      <br />
    </div>
  );
};
export default BlogForm;
