import { BrowserRouter as Router, Link } from "react-router-dom";

const Blog = ({ blog }) => {
  return (
    <div className="ui segment">
      <div>
        <span className="ui divided inverted relaxed list">
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
        </span>
      </div>
    </div>
  );
};
export default Blog;
