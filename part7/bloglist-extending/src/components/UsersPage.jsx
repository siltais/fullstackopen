import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../reducers/userReducer";

const UsersPage = () => {
  const dispatch = useDispatch();
  dispatch(fetchUsers());
  const users = useSelector((state) => state.users);

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default UsersPage;
