import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import NewBlogForm from "./components/NewBlogForm";
import Togglable from "./components/Togglable";
import Notification from "./components/Notification";
import { displayNotification } from "./reducers/notificationReducer";
import { initializeBlogs } from "./reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";

const App = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();


  useEffect(() => {
    if (user !== null) {
      dispatch(initializeBlogs())
    }
  }, [user]);

  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);


  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedInUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(displayNotification("error", "Wrong username or password", 5));
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedInUser");
    setUser(null);
  };



  const handleAddLike = async (blogToLike) => {
    try {
      const updatedBlog = {
        likes: blogToLike.likes + 1,
        author: blogToLike.author,
        title: blogToLike.title,
        url: blogToLike.url,
        user: blogToLike.user.id,
      };
      await blogService.updateBlog(blogToLike.id, updatedBlog);
    } catch (exception) {
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
        await blogService.removeBlog(blogToDelete.id);
        setNewBlog(blogToDelete);
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

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <Notification />
      <div>
        username
        <input
          data-testid="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          data-testid="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogForm = () => (
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
          <Blog
            key={blog.id}
            blog={blog}
            handleAddLike={handleAddLike}
            loggedInUser={user}
            handleRemoveBlog={handleRemoveBlog}
          />
        ))}
      </div>
    </div>
  );

  if (user === null) {
    return loginForm();
  }
  return blogForm();
};

export default App;
