const { test, expect, describe, beforeEach  } = require('@playwright/test')
const { createBlog, loginUser } = require('./helper')

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



    })
})


