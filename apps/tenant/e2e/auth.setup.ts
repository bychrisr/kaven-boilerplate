import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('/');
  await page.waitForURL('**/login');
  
  // Perform authentication
  await page.fill('input[name="email"]', 'admin@kaven.dev');
  await page.fill('input[name="password"]', 'Admin@123');
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard');
  
  // Verify we're logged in
  await expect(page.locator('text=Dashboard')).toBeVisible();
  
  // Save authentication state
  await page.context().storageState({ path: authFile });
});
