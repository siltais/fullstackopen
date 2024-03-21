const { test, expect, describe, beforeEach  } = require('@playwright/test')

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
            await page.getByTestId('username').fill('Ptester')
            await page.getByTestId('password').fill('testerPassword')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('blogs')).toBeVisible()
            await expect(page.getByText('Playwright Tester logged in')).toBeVisible()
            await expect(page.getByText('logout')).toBeVisible()
            await expect(page.getByText('new blog')).toBeVisible()           
        })
    
        test('fails with wrong credentials', async ({ page }) => {
            await page.getByTestId('username').fill('Ptester')
            await page.getByTestId('password').fill('wrong')
            await page.getByRole('button', { name: 'login' }).click() 

            await expect(page.getByText('Wrong username or password')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {   
            await page.getByTestId('username').fill('Ptester')
            await page.getByTestId('password').fill('testerPassword')
            await page.getByRole('button', { name: 'login' }).click()
        })      
        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click()
            await page.getByTestId('title').fill('Playwright test title')
            await page.getByTestId('author').fill('Playwright test author')
            await page.getByTestId('url').fill('https://playwright.dev/')          
            await page.getByRole('button', { name: 'create' }).click()
            await expect(page.getByText('a new blog Playwright test title by Playwright test author added', { exact: true })).toBeVisible()
            await expect(page.getByRole('button', { name: 'new blog' })).toBeVisible()
            await expect(page.getByText('Playwright test title Playwright test author', { exact: true })).toBeVisible()

        })
    })
})


