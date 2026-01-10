import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow user to login', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill login form using ID selectors from TextField component
    await page.fill('#email', 'admin@kaven.dev');
    await page.fill('#password', 'Admin@123');
    
    // Click submit button (looking for type="submit")
    await page.click('button[type="submit"]');

    // Expect to function call or redirect
    // Since we are mocking or depends on backend, we expect at least a toast or redirect attempt
    // For this generic test on a dev DB, we check if URL changes or success message appears
    // If backend is running, it should allow login
    
    // Check for dashboard redirection or "Entrar" button disappearing
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('#email', 'wrong@kaven.dev');
    await page.fill('#password', 'wrongpass');
    await page.click('button[type="submit"]');

    // Expect error alert or toast
    // The component uses sonner toast or local Alert
    // We look for text "Invalid credentials" or "Erro ao fazer login"
    await expect(page.locator('text=Invalid credentials').or(page.locator('text=Erro ao fazer login'))).toBeVisible();
  });
});
