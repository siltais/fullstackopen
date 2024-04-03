import { render, screen } from "@testing-library/react";
import NewBlogForm from "./NewBlogForm";
import userEvent from "@testing-library/user-event";

test("form calls the event handler it received as props with the right details when a new blog is created", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  const { container } = render(<NewBlogForm createBlog={createBlog} />);

  const inputTitle = container.querySelector(".inputTitle");
  const inputAuthor = container.querySelector(".inputAuthor");
  const inputUrl = container.querySelector(".inputUrl");

  await user.type(inputTitle, "testing title input");
  await user.type(inputAuthor, "testing author input");
  await user.type(inputUrl, "testing url input");

  const sendButton = screen.getByText("create");
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toStrictEqual({
    title: "testing title input",
    author: "testing author input",
    url: "testing url input",
  });
});
