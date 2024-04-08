const UserPage = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul className="ui celled list">
        {user.blogs.map((blog) => (
          <li className="item" key={blog.id}>
            {blog.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default UserPage;
