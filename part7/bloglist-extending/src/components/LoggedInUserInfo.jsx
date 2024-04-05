import { setUser } from "../reducers/loginReducer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Notification from "../components/Notification";

const LoggedInUserInfo = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    window.localStorage.removeItem("loggedInUser");
    dispatch(setUser(null));
  };
  const user = useSelector((state) => state.login);
  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
    </div>
  );
};
export default LoggedInUserInfo;
