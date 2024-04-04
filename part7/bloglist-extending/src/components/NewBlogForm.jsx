import { createBlog } from "../reducers/blogReducer";
import { displayNotification } from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { useField } from "../hooks";

const NewBlogForm = () => {
  const dispatch = useDispatch();
  const title = useField("text");
  const author = useField("text");
  const url = useField("text");

  const handleCreateBlog = async (event) => {
    event.preventDefault();
    try {
      const blogToCreate = {
        title: title.value,
        author: author.value,
        url: url.value,
      };
      title.onReset();
      author.onReset();
      url.onReset();
      await dispatch(createBlog(blogToCreate));
      dispatch(
        displayNotification(
          "success",
          `a new blog ${blogToCreate.title} by ${blogToCreate.author} added`,
          5,
        ),
      );
    } catch (exception) {
      dispatch(
        displayNotification(
          "error",
          "Something went wrong! Couldn`t create the blog.",
          5,
        ),
      );
    }
  };

  return (
    <form onSubmit={handleCreateBlog}>
      <h2>create new</h2>
      <div>
        title:
        <input {...title} />
      </div>
      <div>
        author:
        <input {...author} />
      </div>
      <div>
        url:
        <input {...url} />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default NewBlogForm;
