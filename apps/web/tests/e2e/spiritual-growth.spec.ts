import { test, expect } from '@playwright/test';

test.describe('Spiritual Growth Tools', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spiritual-growth');
  });

  test('should load spiritual growth page', async ({ page }) => {
    await expect(page).toHaveTitle(/Gospel Hub/);
    await expect(page.locator('h1')).toContainText('Spiritual Growth');
  });

  test('should navigate between tabs', async ({ page }) => {
    // Test Reading Plans tab
    await page.click('[data-testid="tab-plans"]');
    await expect(page.locator('[data-testid="reading-plans"]')).toBeVisible();
    
    // Test God's Promises tab
    await page.click('[data-testid="tab-promises"]');
    await expect(page.locator('[data-testid="gods-promises"]')).toBeVisible();
    
    // Test Bag of Life tab
    await page.click('[data-testid="tab-bag"]');
    await expect(page.locator('[data-testid="bag-of-life"]')).toBeVisible();
    
    // Test Bible Dictionary tab
    await page.click('[data-testid="tab-dictionary"]');
    await expect(page.locator('[data-testid="bible-dictionary"]')).toBeVisible();
  });

  test('should start a reading plan', async ({ page }) => {
    // Go to Reading Plans tab
    await page.click('[data-testid="tab-plans"]');
    
    // Click on Bible in a Year plan
    await page.click('[data-testid="plan-bible-in-year"]');
    
    // Verify plan started
    await expect(page.locator('[data-testid="plan-progress"]')).toBeVisible();
  });

  test('should claim God\'s promises', async ({ page }) => {
    // Go to God's Promises tab
    await page.click('[data-testid="tab-promises"]');
    
    // Wait for promises to load
    await page.waitForSelector('[data-testid="promise-card"]');
    
    // Click claim button on first promise
    const firstPromise = page.locator('[data-testid="promise-card"]').first();
    await firstPromise.locator('[data-testid="claim-button"]').click();
    
    // Verify promise was claimed
    await expect(firstPromise.locator('[data-testid="claim-button"]')).toHaveText('Claimed');
  });

  test('should add prayer request to Bag of Life', async ({ page }) => {
    // Go to Bag of Life tab
    await page.click('[data-testid="tab-bag"]');
    
    // Click add prayer button
    await page.click('[data-testid="add-prayer-button"]');
    
    // Fill in prayer request
    await page.fill('[data-testid="prayer-title"]', 'Test Prayer Request');
    await page.fill('[data-testid="prayer-description"]', 'This is a test prayer request');
    
    // Submit prayer
    await page.click('[data-testid="submit-prayer"]');
    
    // Verify prayer was added
    await expect(page.locator('[data-testid="prayer-item"]')).toContainText('Test Prayer Request');
  });

  test('should search Bible dictionary', async ({ page }) => {
    // Go to Bible Dictionary tab
    await page.click('[data-testid="tab-dictionary"]');
    
    // Search for a term
    await page.fill('[data-testid="dictionary-search"]', 'grace');
    
    // Wait for results
    await page.waitForSelector('[data-testid="dictionary-results"]');
    
    // Verify results contain search term
    const results = page.locator('[data-testid="dictionary-results"]');
    await expect(results).toContainText('grace');
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile navigation is visible
    await expect(page.locator('[data-testid="mobile-navigation"]')).toBeVisible();
    
    // Test mobile navigation
    await page.click('[data-testid="mobile-tab-promises"]');
    await expect(page.locator('[data-testid="gods-promises"]')).toBeVisible();
  });
});

test.describe('Offline Functionality', () => {
  test('should work offline after initial load', async ({ page, context }) => {
    // Load the page first
    await page.goto('/spiritual-growth');
    await page.waitForLoadState('networkidle');
    
    // Go offline
    await context.setOffline(true);
    
    // Navigate between tabs - should still work
    await page.click('[data-testid="tab-promises"]');
    await expect(page.locator('[data-testid="gods-promises"]')).toBeVisible();
    
    // Try to claim a promise - should work with local storage
    await page.click('[data-testid="claim-button"]');
    await expect(page.locator('[data-testid="claim-button"]')).toHaveText('Claimed');
  });
});