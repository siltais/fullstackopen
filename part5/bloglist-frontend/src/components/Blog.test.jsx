import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders the blog title and author, but does not render its URL or number of likes by default', () => {
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

  render(<Blog blog = { blog } loggedInUser = {loggedInUser} />)

  const element = screen.getByText('Test blog title Jeremmy Tester')
  expect(element).toBeDefined()
  expect(() => screen.getByText('http://www.test.url')).toThrowError()
  expect(() => screen.getByText('likes 2')).toThrowError()



})