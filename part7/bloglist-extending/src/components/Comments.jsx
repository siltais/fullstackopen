import { displayNotification } from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { useField } from "../hooks";
import commentService from "../services/comments";
import { initializeBlogs } from "../reducers/blogReducer";

const Comments = ({ comments, blogId }) => {
  const dispatch = useDispatch();
  const comment = useField("text");

  const handleAddComment = async (event) => {
    event.preventDefault();
    try {
      const commentToCreate = {
        comment: comment.value,
        blogId: blogId,
      };
      comment.onReset();
      await commentService.createNew(commentToCreate);
      dispatch(initializeBlogs());
      dispatch(
        displayNotification("success", `comment successfully added!`, 5),
      );
    } catch (exception) {
      console.log(exception);
      dispatch(
        displayNotification(
          "error",
          "Something went wrong! Couldn`t add comment.",
          5,
        ),
      );
    }
  };

  return (
    <div>
      <h2>comments</h2>
      <form onSubmit={handleAddComment}>
        <input {...comment} />
        <button type="submit">add comment</button>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>{comment.comment}</li>
          ))}
        </ul>
      </form>
    </div>
  );
};
export default Comments;
