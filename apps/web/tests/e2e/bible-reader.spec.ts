import { test, expect } from '@playwright/test';

test.describe('Bible Reader', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bible-enhanced');
  });

  test('should load Bible reader page', async ({ page }) => {
    await expect(page).toHaveTitle(/Gospel Hub/);
    await expect(page.locator('h1')).toContainText('Bible Reader');
  });

  test('should navigate between chapters', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Click next chapter button
    await page.click('[data-testid="next-chapter"]');
    
    // Verify chapter changed
    await expect(page.locator('[data-testid="current-chapter"]')).toContainText('Genesis 2');
  });

  test('should search for verses', async ({ page }) => {
    // Open search
    await page.click('[data-testid="search-button"]');
    
    // Type search query
    await page.fill('[data-testid="search-input"]', 'love');
    
    // Wait for results
    await page.waitForSelector('[data-testid="search-results"]');
    
    // Verify results contain search term
    const results = page.locator('[data-testid="search-results"]');
    await expect(results).toContainText('love');
  });

  test('should bookmark verses', async ({ page }) => {
    // Wait for verses to load
    await page.waitForSelector('[data-testid="verse-card"]');
    
    // Click bookmark button on first verse
    const firstVerse = page.locator('[data-testid="verse-card"]').first();
    await firstVerse.locator('[data-testid="bookmark-button"]').click();
    
    // Verify bookmark was added
    await expect(firstVerse.locator('[data-testid="bookmark-button"]')).toHaveClass(/text-primary-600/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile navigation is visible
    await expect(page.locator('[data-testid="mobile-navigation"]')).toBeVisible();
    
    // Verify content is properly sized
    const content = page.locator('[data-testid="bible-content"]');
    await expect(content).toBeVisible();
  });
});

test.describe('PWA Functionality', () => {
  test('should be installable', async ({ page, context }) => {
    await page.goto('/');
    
    // Check for install prompt
    const installPrompt = page.locator('[data-testid="pwa-install-prompt"]');
    await expect(installPrompt).toBeVisible();
    
    // Check manifest
    const manifest = await page.evaluate(() => {
      const link = document.querySelector('link[rel="manifest"]');
      return link?.getAttribute('href');
    });
    expect(manifest).toBe('/manifest.json');
  });

  test('should work offline', async ({ page, context }) => {
    // Load the page first
    await page.goto('/bible-enhanced');
    await page.waitForLoadState('networkidle');
    
    // Go offline
    await context.setOffline(true);
    
    // Try to navigate - should still work
    await page.click('[data-testid="next-chapter"]');
    await expect(page.locator('[data-testid="current-chapter"]')).toContainText('Genesis 2');
  });
});