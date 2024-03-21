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


})
