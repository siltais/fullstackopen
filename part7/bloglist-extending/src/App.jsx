import { useEffect } from "react";
import blogService from "./services/blogs";
import commentService from "./services/comments";
import { initializeBlogs } from "./reducers/blogReducer";
import { setUser } from "./reducers/loginReducer";
import { fetchUsers } from "./reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import UsersPage from "./components/UsersPage";
import UserPage from "./components/UserPage";
import BlogPage from "./components/BlogPage";
import Notification from "./components/Notification";
import LoggedInUserInfo from "./components/LoggedInUserInfo";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useMatch,
  Link,
} from "react-router-dom";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
      commentService.setToken(user.token);
    }
  }, []);

  const user = useSelector((state) => state.login);
  const blogs = useSelector((state) => state.blogs);

  const matchBlogs = useMatch("/blogs/:id");
  const blogInfo = matchBlogs
    ? blogs.find((blog) => blog.id === matchBlogs.params.id)
    : null;

  const users = useSelector((state) => state.users);
  const match = useMatch("/users/:id");
  const userInfo = match
    ? users.find((user) => user.id === match.params.id)
    : null;

  useEffect(() => {
    if (user !== null) {
      dispatch(initializeBlogs());
      dispatch(fetchUsers());
    }
  }, [user, matchBlogs]);

  const padding = {
    padding: 5,
  };

  const navStyle = {
    backgroundColor: "#d3d3d3",
    padding: 10,
  };

  const loginForm = () => <LoginForm />;
  const blogForm = () => (
    <div>
      <div style={navStyle}>
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
        <LoggedInUserInfo />
      </div>
      <h2>blog app</h2>
      <Notification />
      <Routes>
        <Route path="/" element={<BlogForm />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserPage user={userInfo} />} />
        <Route path="/blogs/:id" element={<BlogPage blog={blogInfo} />} />
      </Routes>
    </div>
  );

  if (user === null) {
    return loginForm();
  }
  return blogForm();
};

export default App;
