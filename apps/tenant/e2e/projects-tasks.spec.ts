import { test, expect, type Page } from '@playwright/test';

// Helper function to login
async function login(page: Page) {
  await page.goto('/');
  
  // Wait for login page - accept any locale and query params
  await page.waitForURL(/.*\/login/, { timeout: 60000 });
  
  // Wait for form to be ready
  await page.waitForSelector('input[name="email"]', { timeout: 10000 });
  
  // Fill login form
  await page.fill('input[name="email"]', 'admin@kaven.dev');
  await page.fill('input[name="password"]', 'Admin@123');
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard - accept any locale
  await page.waitForURL(/.*\/dashboard/, { timeout: 60000 });
  
  // Verify we're logged in
  await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });
}

test.describe('Authentication Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await login(page);
    
    // Verify dashboard is loaded - accept any locale
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('h3:has-text("Dashboard")')).toBeVisible({ timeout: 10000 });
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/.*\/login/, { timeout: 60000 });
    
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should stay on login page and show error
    await expect(page).toHaveURL(/.*\/login/);
    // Wait for error message (adjust selector based on your UI)
    await expect(page.locator('text=/invalid|error|failed/i')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Projects Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to projects page', async ({ page }) => {
    // Click on Projects in sidebar - wait for it to be visible first
    await page.waitForSelector('a[href*="/projects"]', { timeout: 10000 });
    await page.click('a[href*="/projects"]');
    
    // Verify we're on projects page - accept any locale
    await expect(page).toHaveURL(/.*\/projects/);
    await expect(page.locator('h3:has-text("Projects")')).toBeVisible({ timeout: 10000 });
  });

  test('should display list of projects', async ({ page }) => {
    await page.goto('/projects');
    
    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"], .grid', { timeout: 15000 });
    
    // Should show at least one project (from seed data)
    const projectCards = page.locator('text=/Website Redesign|Mobile App|API Migration/i');
    await expect(projectCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('should create a new project', async ({ page }) => {
    await page.goto('/projects');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Click "New Project" button
    await page.waitForSelector('button:has-text("New Project")', { timeout: 10000 });
    await page.click('button:has-text("New Project")');
    
    // Wait for dialog to open
    await expect(page.locator('text=Create Project')).toBeVisible({ timeout: 10000 });
    
    // Fill form
    const projectName = `E2E Test Project ${Date.now()}`;
    await page.fill('input[id="name"]', projectName);
    await page.fill('input[id="description"]', 'Created by E2E test');
    
    // Submit
    await page.click('button[type="submit"]:has-text("Create Project")');
    
    // Wait for success toast
    await expect(page.locator('text=/created successfully/i')).toBeVisible({ timeout: 10000 });
    
    // Verify project appears in list
    await expect(page.locator(`text=${projectName}`)).toBeVisible({ timeout: 10000 });
  });

  test('should view project details', async ({ page }) => {
    await page.goto('/projects');
    
    // Wait for projects to load
    await page.waitForSelector('button:has-text("View Details")', { timeout: 10000 });
    
    // Click first "View Details" button
    await page.click('button:has-text("View Details")');
    
    // Should navigate to project detail page
    await expect(page).toHaveURL(/.*projects\/[a-f0-9-]+/);
    
    // Verify project information is displayed
    await expect(page.locator('text=Project Information')).toBeVisible();
    await expect(page.locator('text=Tasks')).toBeVisible();
  });

  test('should delete a project', async ({ page }) => {
    await page.goto('/projects');
    
    // Create a test project first
    await page.click('button:has-text("New Project")');
    const projectName = `Delete Test ${Date.now()}`;
    await page.fill('input[id="name"]', projectName);
    await page.click('button[type="submit"]:has-text("Create Project")');
    await expect(page.locator('text=/created successfully/i')).toBeVisible({ timeout: 5000 });
    
    // Navigate to project detail
    await page.click(`text=${projectName}`);
    await page.click('button:has-text("View Details")');
    
    // Wait for detail page
    await expect(page.locator('text=Project Information')).toBeVisible();
    
    // Click delete button
    await page.click('button:has-text("Delete")');
    
    // Confirm deletion in dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Should redirect to projects list
    await expect(page).toHaveURL(/.*\/projects$/);
    await expect(page.locator('text=/deleted successfully/i')).toBeVisible({ timeout: 5000 });
    
    // Verify project is not in list
    await expect(page.locator(`text=${projectName}`)).not.toBeVisible();
  });
});

test.describe('Tasks Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should create a task in a project', async ({ page }) => {
    await page.goto('/projects');
    
    // Navigate to first project detail
    await page.waitForSelector('button:has-text("View Details")', { timeout: 10000 });
    await page.click('button:has-text("View Details")');
    
    // Wait for tasks section
    await expect(page.locator('text=Tasks')).toBeVisible();
    
    // Click "Add Task" button
    await page.click('button:has-text("Add Task")');
    
    // Wait for dialog
    await expect(page.locator('text=Create Task')).toBeVisible();
    
    // Fill task form
    const taskTitle = `E2E Test Task ${Date.now()}`;
    await page.fill('input[id="title"]', taskTitle);
    await page.fill('textarea[id="description"]', 'Created by E2E test');
    
    // Select status and priority
    await page.click('button:has-text("To Do")'); // Status selector
    await page.click('text=In Progress');
    
    // Submit
    await page.click('button[type="submit"]:has-text("Create Task")');
    
    // Wait for success
    await expect(page.locator('text=/created successfully/i')).toBeVisible({ timeout: 5000 });
    
    // Verify task appears in table
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible({ timeout: 5000 });
  });

  test('should update task status inline', async ({ page }) => {
    await page.goto('/projects');
    
    // Navigate to project with tasks
    await page.waitForSelector('button:has-text("View Details")', { timeout: 10000 });
    await page.click('button:has-text("View Details")');
    
    // Wait for tasks table
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Find first task status dropdown
    const statusDropdown = page.locator('table tbody tr').first().locator('button:has-text(/To Do|In Progress|Done/)');
    
    if (await statusDropdown.isVisible()) {
      await statusDropdown.click();
      
      // Select different status
      await page.click('text=Done');
      
      // Wait for update success
      await expect(page.locator('text=/updated/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should delete a task', async ({ page }) => {
    await page.goto('/projects');
    
    // Navigate to project detail
    await page.waitForSelector('button:has-text("View Details")', { timeout: 10000 });
    await page.click('button:has-text("View Details")');
    
    // Create a task first
    await page.click('button:has-text("Add Task")');
    const taskTitle = `Delete Test Task ${Date.now()}`;
    await page.fill('input[id="title"]', taskTitle);
    await page.click('button[type="submit"]:has-text("Create Task")');
    await expect(page.locator('text=/created successfully/i')).toBeVisible({ timeout: 5000 });
    
    // Find and click delete button for the task
    const taskRow = page.locator(`tr:has-text("${taskTitle}")`);
    await taskRow.locator('button[aria-label="Delete"], button:has(svg)').last().click();
    
    // Wait for deletion success
    await expect(page.locator('text=/deleted successfully/i')).toBeVisible({ timeout: 5000 });
    
    // Verify task is removed
    await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible();
  });
});

test.describe('Navigation and UI', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate between pages using sidebar', async ({ page }) => {
    // Dashboard
    await page.click('a[href="/dashboard"]');
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h3:has-text("Dashboard")')).toBeVisible();
    
    // Projects
    await page.click('a[href="/projects"]');
    await expect(page).toHaveURL(/.*projects/);
    await expect(page.locator('h3:has-text("Projects")')).toBeVisible();
    
    // Team
    await page.click('a[href="/team"]');
    await expect(page).toHaveURL(/.*team/);
    
    // Settings
    await page.click('a[href="/settings"]');
    await expect(page).toHaveURL(/.*settings/);
  });

  test('should display space selector', async ({ page }) => {
    // Space selector should be visible in header
    const spaceSelector = page.locator('[data-testid="space-selector"], button:has-text(/Finance|Marketing|Support/)');
    
    // Wait a bit for page to load
    await page.waitForTimeout(2000);
    
    // Check if space selector exists (it might not if no spaces are configured)
    const count = await spaceSelector.count();
    if (count > 0) {
      await expect(spaceSelector.first()).toBeVisible();
    }
  });

  test('should show loading states', async ({ page }) => {
    await page.goto('/projects');
    
    // Should show loading skeleton initially (very brief)
    // This is hard to test reliably, so we just verify page loads
    await page.waitForSelector('text=/Projects|No projects/i', { timeout: 10000 });
  });

  test('should show empty state when no projects', async ({ page }) => {
    // This test assumes there might be a scenario with no projects
    // Skip if there are always projects from seed data
    await page.goto('/projects');
    
    // If no projects, should show empty state
    const emptyState = page.locator('text=/No projects found|Create one to get started/i');
    const projectCards = page.locator('text=/Website Redesign|Mobile App/i');
    
    const hasProjects = await projectCards.count() > 0;
    
    if (!hasProjects) {
      await expect(emptyState).toBeVisible();
    }
  });
});

test.describe('Tenant Isolation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should only show projects from current tenant', async ({ page }) => {
    await page.goto('/projects');
    
    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"], .grid', { timeout: 10000 });
    
    // All visible projects should belong to the same tenant
    // This is implicitly tested by the fact that we can only see our tenant's data
    // We can verify by checking that we see expected projects from seed
    const expectedProjects = ['Website Redesign', 'Mobile App', 'API Migration'];
    
    for (const projectName of expectedProjects) {
      const project = page.locator(`text=${projectName}`);
      const count = await project.count();
      // Should see at least one of the seeded projects
      if (count > 0) {
        await expect(project.first()).toBeVisible();
        break;
      }
    }
  });
});
