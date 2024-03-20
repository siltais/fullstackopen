import { render, screen } from '@testing-library/react'
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

  render(<Blog blog = { blog } loggedInUser = {loggedInUser} />)

  const elementAuthorTitle = screen.getByText('Test blog title Jeremmy Tester')
  const elementUrl = screen.queryByText('http://www.test.url')
  const elementLikes = screen.queryByText('likes 2')

  expect(elementAuthorTitle).toBeDefined()
  expect(elementUrl).toBeNull()
  expect(elementLikes).toBeNull()

})



