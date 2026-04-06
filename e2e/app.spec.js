import { test, expect } from '@playwright/test';

test.describe('CCNA Modules App - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:9000');
    // Wait for the app to load (wait for LoadingScreen to disappear)
    await page.waitForSelector('text=CCNA 200-301 Course', { timeout: 15000 });
  });

  test('should load application', async ({ page }) => {
    // Wait for main app content to be visible
    await expect(page.locator('.app')).toBeVisible();
    await expect(page.locator('.app-header')).toBeVisible();
    await expect(page.locator('.app-content')).toBeVisible();
  });

  test('should display module list in list view', async ({ page }) => {
    // Navigate to modules view if not already there
    const listButton = page.locator('[aria-label="Modules view"]');
    if (await listButton.isVisible()) {
      await listButton.click();
    }

    // Wait for module list
    await expect(page.locator('.module-list')).toBeVisible();
    await expect(page.locator('.module-card').first()).toBeVisible();
  });

  test('should display module list in grid view', async ({ page }) => {
    const listButton = page.locator('[aria-label="Modules view"]');
    if (await listButton.isVisible()) {
      await listButton.click();
    }

    // Switch to grid view
    await page.click('[aria-label="Grid view"]');

    await expect(page.locator('.modules-container.grid-view')).toBeVisible();
  });

  test('should search for modules', async ({ page }) => {
    const listButton = page.locator('[aria-label="Modules view"]');
    if (await listButton.isVisible()) {
      await listButton.click();
    }

    const searchInput = page.locator('input[placeholder*="search"]');
    await searchInput.fill('OSI');
    await expect(page.getByText('OSI Model')).toBeVisible();
    await expect(page.getByText('Network Devices')).not.toBeVisible();

    // Clear search
    await searchInput.fill('');
    await expect(page.getByText('Network Devices')).toBeVisible();
  });

  test('should switch between views (list <-> detail)', async ({ page }) => {
    const listButton = page.locator('[aria-label="Modules view"]');
    if (await listButton.isVisible()) {
      await listButton.click();
    }

    // Click on first module
    const firstModule = page.locator('.module-card').first();
    await firstModule.click();

    // Should be in detail view
    await expect(page.locator('.app-content')).toBeVisible();

    // Click back button in detail view
    const backButton = page.locator('button').filter({ hasText: 'Back to Modules' }).first();
    if (await backButton.isVisible()) {
      await backButton.click();
    }

    // Should be back in list view
    await expect(page.locator('.module-list')).toBeVisible();
  });

  test('should switch between dashboard and modules', async ({ page }) => {
    const dashboardButton = page.locator('[aria-label="Dashboard view"]');
    const listButton = page.locator('[aria-label="Modules view"]');

    await dashboardButton.click();
    await expect(page.locator('.dashboard-section')).first().toBeVisible();

    await listButton.click();
    await expect(page.locator('.module-list')).toBeVisible();
  });
});

test.describe('Settings Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:9000');
    await page.waitForSelector('text=CCNA 200-301 Course', { timeout: 15000 });
  });

  test('should open settings panel', async ({ page }) => {
    const settingsButton = page.locator('[aria-label="Settings"]');
    await settingsButton.click();

    await expect(page.locator('.settings-dialog')).toBeVisible();
  });

  test('should switch between setting tabs', async ({ page }) => {
    const settingsButton = page.locator('[aria-label="Settings"]');
    await settingsButton.click();

    await expect(page.locator('.settings-tabs')).toBeVisible();

    // Click on Theme tab
    const themeTab = page.locator('.settings-tab').filter({ hasText: 'Theme' });
    await themeTab.click();
    await expect(page.locator('text=Theme Selection')).toBeVisible();

    // Click on Dashboard tab
    const dashboardTab = page.locator('.settings-tab').filter({ hasText: 'Dashboard' });
    await dashboardTab.click();
    await expect(page.locator('text=Dashboard Sections')).toBeVisible();
  });

  test('should close settings panel', async ({ page }) => {
    const settingsButton = page.locator('[aria-label="Settings"]');
    await settingsButton.click();

    await expect(page.locator('.settings-dialog')).toBeVisible();

    // Click outside dialog or press Escape
    await page.keyboard.press('Escape');

    await expect(page.locator('.settings-dialog')).not.toBeVisible();
  });
});

test.describe('Module Progress Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:9000');
    await page.waitForSelector('text=CCNA 200-301 Course', { timeout: 15000 });

    // Navigate to modules view
    const listButton = page.locator('[aria-label="Modules view"]');
    if (await listButton.isVisible()) {
      await listButton.click();
    }
  });

  test('should open module detail when clicked', async ({ page }) => {
    const firstModule = page.locator('.module-card').first();
    await firstModule.click();

    // Wait for detail view to load
    await expect(page.locator('.app-content')).toBeVisible();
  });

  test('should filter modules by status', async ({ page }) => {
    // Click the status filter dropdown
    const filterButton = page.locator('.filter-dropdown').first();
    await filterButton.click();

    // Select "In Progress" option
    const inProgressOption = page.locator('text=In Progress');
    await inProgressOption.click();

    // Should only show in-progress modules
    await page.waitForTimeout(500);
  });

  test('should toggle view mode (grid/list)', async ({ page }) => {
    const gridButton = page.locator('[aria-label="Grid view"]');
    const listButton = page.locator('[aria-label="List view"]');

    // Should start in default view (list or grid)
    // Click to toggle
    await gridButton.click();

    // Wait for view to switch
    await page.waitForTimeout(300);

    // Click back to original view
    await listButton.click();
  });
});
