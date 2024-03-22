const createBlog = async (page, content) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('title').fill(content.title)
    await page.getByTestId('author').fill(content.author)
    await page.getByTestId('url').fill(content.url) 
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText(`a new blog ${content.title} by ${content.author} added`, { exact: true }).waitFor()
    await page.getByText(`${content.title} ${content.author}`, { exact: true }).waitFor()
}

const loginUser = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const likeBlog = async (page, blogTitle, blogUrl, expectedLikes) => {
  const selectedBlog = await page.getByText(blogTitle, { exact: true }).locator('..')
  await selectedBlog.getByRole('button', { name: 'view' }).click()
  const selectedUrl = await page.getByText(blogUrl, { exact: true }).locator('..')

  await selectedUrl.getByRole('button', { name: 'like' }).click()
  await selectedUrl.getByText(expectedLikes).waitFor()
  await selectedBlog.getByRole('button', { name: 'hide' }).click()
}

export {createBlog, loginUser, likeBlog}