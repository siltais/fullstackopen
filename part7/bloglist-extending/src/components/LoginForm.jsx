import { useDispatch } from "react-redux";
import { displayNotification } from "../reducers/notificationReducer";
import { loginUser } from "../reducers/loginReducer";
import Notification from "../components/Notification";
import { useField } from "../hooks";

const LoginForm = () => {
  const dispatch = useDispatch();
  const username = useField("text");
  const password = useField("password");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await dispatch(loginUser(username.value, password.value));
      username.onReset();
      password.onReset();
    } catch (exception) {
      console.log(exception);
      dispatch(displayNotification("error", "Wrong username or password", 5));
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <Notification />
      <div>
        username
        <input {...username} />
      </div>
      <div>
        password
        <input {...password} />
      </div>
      <button type="submit">login</button>
    </form>
  );
};
export default LoginForm;
