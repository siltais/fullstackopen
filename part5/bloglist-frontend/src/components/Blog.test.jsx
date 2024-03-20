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

  const { container } = render(<Blog blog={blog} loggedInUser = { loggedInUser } />)
  const elementAuthorTitle = screen.getByText('Test blog title Jeremmy Tester')
  const div = container.querySelector('.hiddenInBlog')
  
  expect(elementAuthorTitle).toBeDefined()
  expect(div).toHaveStyle('display: none')
  
})

test('blog URL and number of likes are shown when the show button has been clicked', async () => {

  const { container } = render(<Blog blog={blog} loggedInUser = { loggedInUser } />)
  const div = container.querySelector('.hiddenInBlog')

  expect(div).toHaveStyle('display: none')
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(div).not.toHaveStyle('display: none')



})







