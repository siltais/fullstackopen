import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const loggedInUser = {
  username:'testUsername'
}
const blog = {
  title: 'Test blog title',
  author: 'Jeremmy Tester',
  url: 'http://www.test.url',
  user: {
    name: 'Martini Akko',
    username: 'mako'
  },
  likes:2
}

test('renders the blog title and author, but does not render its URL or number of likes by default', () => {
  const { container } = render(<Blog blog = {blog} loggedInUser = {loggedInUser} />)
  const elementAuthorTitle = screen.getByText('Test blog title Jeremmy Tester')
  const elementUrl = screen.getByText('http://www.test.url')
  const elementLikes = screen.getByText('likes 2')
  const div = container.querySelector('.hiddenInBlog')
  
  expect(elementAuthorTitle).toBeDefined()
  expect(elementAuthorTitle).toBeVisible()
  expect(div).toHaveStyle('display: none')
  expect(elementUrl).not.toBeVisible()
  expect(elementLikes).not.toBeVisible()

})

test('blog URL and number of likes are shown when the show button has been clicked', async () => {
  const { container } = render(<Blog blog = {blog} loggedInUser = {loggedInUser} />)
  const div = container.querySelector('.hiddenInBlog')
  const elementUrl = screen.getByText('http://www.test.url')
  const elementLikes = screen.getByText('likes 2')

  expect(div).toHaveStyle('display: none')
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(div).not.toHaveStyle('display: none')
  expect(elementUrl).toBeVisible()
  expect(elementLikes).toBeVisible()
})

test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
  const mockHandler = vi.fn()
  render(<Blog blog={blog} loggedInUser = {loggedInUser} handleAddLike = {mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})





