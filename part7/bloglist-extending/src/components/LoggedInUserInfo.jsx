import { setUser } from "../reducers/loginReducer";
import { useDispatch, useSelector } from "react-redux";

const LoggedInUserInfo = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    window.localStorage.removeItem("loggedInUser");
    dispatch(setUser(null));
  };
  const user = useSelector((state) => state.login);
  return (
    <span>
      {user.name} logged in <button onClick={handleLogout}>logout</button>
    </span>
  );
};
export default LoggedInUserInfo;
