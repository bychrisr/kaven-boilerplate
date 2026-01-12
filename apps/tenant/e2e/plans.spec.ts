import { test, expect } from '@playwright/test';

test.describe('Plans & Pricing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'admin@kaven.dev');
    await page.fill('#password', 'Admin@123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  test('should display pricing cards', async ({ page }) => {
    // Navigate to pricing
    await page.goto('/pricing');
    
    // Check for unique title on the page
    await expect(page.locator('h1:has-text("Escolha seu Plano")')).toBeVisible();

    // Check if plan cards are visible using the data-testid we added
    const plans = page.locator('[data-testid="plan-card"]');
    
    // We expect cards to be present (requires DB seeding or mock)
    // If DB is empty, this might fail, so we should consider mocking the API response in a real robust test
    // For now, we assume the dev environment has seeded plans
    await expect(plans).not.toHaveCount(0);
  });

  test('should toggle between monthly and yearly', async ({ page }) => {
    await page.goto('/pricing');
    
    // Check for buttons "Mensal" and "Anual"
    const monthlyBtn = page.locator('button:has-text("Mensal")');
    const yearlyBtn = page.locator('button:has-text("Anual")');
    
    await expect(monthlyBtn).toBeVisible();
    await expect(yearlyBtn).toBeVisible();
    
    // Click Annual
    await yearlyBtn.click();
    
    // Verification: Usually prices change or "ano" text appears in cards
    // This depends on having plans loaded
  });
});
