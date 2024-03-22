const { test, expect, describe, beforeEach  } = require('@playwright/test')
const { createBlog, loginUser, likeBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
          data: {
            name: 'Playwright Tester',
            username: 'Ptester',
            password: 'testerPassword'
          }
        })
        await page.goto('/')
      })

    test('displays the login form by default', async ({ page }) => {
        const locator = await page.getByText('log in to application')
        await expect(locator).toBeVisible()

        await expect(page.getByText('username')).toBeVisible()
        await expect(page.getByTestId('username')).toBeVisible()

        await expect(page.getByText('password')).toBeVisible()
        await expect(page.getByTestId('password')).toBeVisible()

        await expect(page.getByText('login')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginUser(page, 'Ptester', 'testerPassword')
            await expect(page.getByText('blogs')).toBeVisible()
            await expect(page.getByText('Playwright Tester logged in')).toBeVisible()
            await expect(page.getByText('logout')).toBeVisible()
            await expect(page.getByText('new blog')).toBeVisible()           
        })
    
        test('fails with wrong credentials', async ({ page }) => {
            await loginUser(page, 'Ptester', 'fakePassword')
            await expect(page.getByText('Wrong username or password')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {   
            await loginUser(page, 'Ptester', 'testerPassword')
        })      
        
        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, {
                title: 'Playwright test title', 
                author: 'Playwright test author', 
                url: 'https://playwright.dev/'
            })
            await expect(page.getByRole('button', { name: 'new blog' })).toBeVisible()
            await expect(page.getByText('Playwright test title Playwright test author', { exact: true })).toBeVisible()
        })
        
        test('blog can be edited', async ({ page }) => {
            await createBlog(page, {
                title: 'Another test title', 
                author: 'Another test author', 
                url: 'https://anothertesturl.dev/'
            })
            const selectedBlog = await page.getByText('Another test title Another test author', { exact: true }).locator('..')
            await selectedBlog.getByRole('button', { name: 'view' }).click()
            const selectedUrl = await page.getByText('https://anothertesturl.dev/', { exact: true }).locator('..')
            await expect(selectedUrl.getByText('likes 0')).toBeVisible()
            await selectedUrl.getByRole('button', { name: 'like' }).click()
            await expect(selectedUrl.getByText('likes 1')).toBeVisible()
        })
        
        test('user who added the blog can delete the blog', async ({ page }) => {
            await createBlog(page, {
                title: 'Delete blog title', 
                author: 'Delete blog author', 
                url: 'https://deleteblog.url/'
            })
            const selectedBlog = await page.getByText('Delete blog title Delete blog author', { exact: true }).locator('..')
            await selectedBlog.getByRole('button', { name: 'view' }).click()
            await page.evaluate(() => window.confirm = function(){return true})
            await selectedBlog.getByRole('button', { name: 'Remove' }).click()
            await page.on('dialog', dialog => dialog.accept())
            
            const deletedBlog = await page.getByText('Delete blog title Delete blog author', { exact: true })
            await expect(deletedBlog).not.toBeVisible()
        })

        test('only the user who added the blog sees the blog delete button', async ({ page, request }) => {
            await request.post('/api/users', {
                data: {
                  name: 'Another Tester',
                  username: 'Atester',
                  password: 'testerPassword'
                }
            })
            await createBlog(page, {
                title: 'Remove button seen test', 
                author: 'Remove button test author', 
                url: 'https://removebuttontest.url/'
            })
            const selectedBlog = await page.getByText('Remove button seen test Remove button test author', { exact: true }).locator('..')
            await selectedBlog.getByRole('button', { name: 'view' }).click()
            await expect(selectedBlog.getByRole('button', { name: 'Remove' })).toBeVisible()

            await page.getByRole('button', { name: 'logout' }).click()
            await loginUser(page, 'Atester', 'testerPassword')

            await selectedBlog.getByRole('button', { name: 'view' }).click()
            await expect(selectedBlog.getByRole('button', { name: 'Remove' })).not.toBeVisible()
        })

        test('blogs are arranged in the order according to the likes, the blog with the most likes first', async ({ page }) => {
            await createBlog(page, {
                title: 'title1', 
                author: 'author1', 
                url: 'https://url1.url/'
            })
            await createBlog(page, {
                title: 'title2', 
                author: 'author2', 
                url: 'https://url2.url/'
            })
            await createBlog(page, {
                title: 'title3', 
                author: 'author3', 
                url: 'https://url3.url/'
            })
            await createBlog(page, {
                title: 'title4', 
                author: 'author4', 
                url: 'https://url4.url/'
            })

            const blogListStart = await page.getByTestId('blogList').locator('span.blogTitle')
            await expect(blogListStart).toHaveCount(4)

            const firstBlog = await page.getByTestId('blogList').locator('span.blogTitle').nth(0)
            const secondBlog = await page.getByTestId('blogList').locator('span.blogTitle').nth(1)
            const thirdBlog = await page.getByTestId('blogList').locator('span.blogTitle').nth(2)
            const fourthBlog = await page.getByTestId('blogList').locator('span.blogTitle').nth(3)

            await expect(firstBlog).toHaveText('title1 author1')
            await expect(secondBlog).toHaveText('title2 author2')
            await expect(thirdBlog).toHaveText('title3 author3')
            await expect(fourthBlog).toHaveText('title4 author4')

            await likeBlog(page, 'title1 author1', 'https://url1.url/', 'likes 1')

            await likeBlog(page, 'title3 author3', 'https://url3.url/', 'likes 1')
            await likeBlog(page, 'title3 author3', 'https://url3.url/', 'likes 2')
            await likeBlog(page, 'title3 author3', 'https://url3.url/', 'likes 3')
            await likeBlog(page, 'title3 author3', 'https://url3.url/', 'likes 4')
            await likeBlog(page, 'title3 author3', 'https://url3.url/', 'likes 5')

            await likeBlog(page, 'title4 author4', 'https://url4.url/', 'likes 1')
            await likeBlog(page, 'title4 author4', 'https://url4.url/', 'likes 2')
            await likeBlog(page, 'title4 author4', 'https://url4.url/', 'likes 3')

            const firstBlogEnd = await page.getByTestId('blogList').locator('span.blogTitle').nth(0)
            const secondBlogEnd = await page.getByTestId('blogList').locator('span.blogTitle').nth(1)
            const thirdBlogEnd = await page.getByTestId('blogList').locator('span.blogTitle').nth(2)
            const fourthBlogEnd = await page.getByTestId('blogList').locator('span.blogTitle').nth(3)

            await expect(firstBlogEnd).toHaveText('title3 author3')
            await expect(secondBlogEnd).toHaveText('title4 author4')
            await expect(thirdBlogEnd).toHaveText('title1 author1')
            await expect(fourthBlogEnd).toHaveText('title2 author2')

        })

    })
})


