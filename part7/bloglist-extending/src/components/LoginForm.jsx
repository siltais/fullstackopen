import { useDispatch } from "react-redux";
import { displayNotification } from "../reducers/notificationReducer";
import { loginUser } from "../reducers/loginReducer";
import Notification from "../components/Notification";
import { useField } from "../hooks";
import { FormField, Form, Input } from "semantic-ui-react";

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
    <Form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <Notification />
      <FormField>
        <label>Username</label>
        <Input {...username} />
      </FormField>
      <FormField>
        <label>Password</label>
        <Input {...password} />
      </FormField>
      <button className="ui button" type="submit">
        login
      </button>
    </Form>
  );
};
export default LoginForm;
