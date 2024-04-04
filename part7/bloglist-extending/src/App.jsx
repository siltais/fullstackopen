import { useEffect } from "react";
import blogService from "./services/blogs";
import { initializeBlogs } from "./reducers/blogReducer";
import { setUser } from "./reducers/loginReducer";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  const user = useSelector((state) => state.login);
  useEffect(() => {
    if (user !== null) {
      dispatch(initializeBlogs());
    }
  }, [user]);

  const loginForm = () => <LoginForm />;
  const blogForm = () => <BlogForm />;

  if (user === null) {
    return loginForm();
  }
  return blogForm();
};

export default App;
