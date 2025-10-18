import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test('User can install PWA and use all features offline', async ({ page, context }) => {
    // 1. User visits the site
    await page.goto('/');
    await expect(page).toHaveTitle(/Gospel Hub/);

    // 2. User installs PWA
    const installPrompt = page.locator('[data-testid="pwa-install-prompt"]');
    if (await installPrompt.isVisible()) {
      await page.click('[data-testid="install-button"]');
    }

    // 3. User navigates to Bible reader
    await page.goto('/bible-enhanced');
    await page.waitForLoadState('networkidle');

    // 4. User reads Genesis 1
    await expect(page.locator('[data-testid="current-chapter"]')).toContainText('Genesis 1');
    
    // 5. User bookmarks a verse
    const firstVerse = page.locator('[data-testid="verse-card"]').first();
    await firstVerse.locator('[data-testid="bookmark-button"]').click();
    await expect(firstVerse.locator('[data-testid="bookmark-button"]')).toHaveClass(/text-primary-600/);

    // 6. User searches for "love"
    await page.click('[data-testid="search-button"]');
    await page.fill('[data-testid="search-input"]', 'love');
    await page.waitForSelector('[data-testid="search-results"]');
    await expect(page.locator('[data-testid="search-results"]')).toContainText('love');

    // 7. User goes to spiritual growth tools
    await page.goto('/spiritual-growth');
    await page.waitForLoadState('networkidle');

    // 8. User starts a reading plan
    await page.click('[data-testid="tab-plans"]');
    await page.click('[data-testid="plan-bible-in-year"]');
    await expect(page.locator('[data-testid="plan-progress"]')).toBeVisible();

    // 9. User claims God's promises
    await page.click('[data-testid="tab-promises"]');
    await page.waitForSelector('[data-testid="promise-card"]');
    
    const firstPromise = page.locator('[data-testid="promise-card"]').first();
    await firstPromise.locator('[data-testid="claim-button"]').click();
    await expect(firstPromise.locator('[data-testid="claim-button"]')).toHaveText('Claimed');

    // 10. User adds prayer to Bag of Life
    await page.click('[data-testid="tab-bag"]');
    await page.click('[data-testid="add-prayer-button"]');
    
    await page.fill('[data-testid="prayer-title"]', 'Test Prayer Request');
    await page.fill('[data-testid="prayer-description"]', 'This is a test prayer request for healing');
    await page.click('[data-testid="submit-prayer"]');
    
    await expect(page.locator('[data-testid="prayer-item"]')).toContainText('Test Prayer Request');

    // 11. User searches Bible dictionary
    await page.click('[data-testid="tab-dictionary"]');
    await page.fill('[data-testid="dictionary-search"]', 'grace');
    await page.waitForSelector('[data-testid="dictionary-results"]');
    await expect(page.locator('[data-testid="dictionary-results"]')).toContainText('grace');

    // 12. User goes offline and continues using the app
    await context.setOffline(true);
    
    // 13. User can still read Bible
    await page.goto('/bible-enhanced');
    await expect(page.locator('[data-testid="current-chapter"]')).toContainText('Genesis 1');
    
    // 14. User can still access spiritual growth tools
    await page.goto('/spiritual-growth');
    await page.click('[data-testid="tab-promises"]');
    await expect(page.locator('[data-testid="gods-promises"]')).toBeVisible();
    
    // 15. User can still claim promises (stored locally)
    await page.click('[data-testid="claim-button"]');
    await expect(page.locator('[data-testid="claim-button"]')).toHaveText('Claimed');

    // 16. User can still access Bag of Life
    await page.click('[data-testid="tab-bag"]');
    await expect(page.locator('[data-testid="prayer-item"]')).toContainText('Test Prayer Request');
  });

  test('Mobile user experience is smooth', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 1. User visits on mobile
    await page.goto('/');
    await expect(page).toHaveTitle(/Gospel Hub/);

    // 2. User sees mobile navigation
    await expect(page.locator('[data-testid="mobile-navigation"]')).toBeVisible();

    // 3. User navigates using mobile tabs
    await page.click('[data-testid="mobile-tab-promises"]');
    await expect(page.locator('[data-testid="gods-promises"]')).toBeVisible();

    // 4. User uses swipe gestures
    await page.goto('/bible-enhanced');
    await page.waitForLoadState('networkidle');
    
    // Swipe left to next chapter
    await page.touchscreen.tap(300, 400);
    await page.mouse.move(300, 400);
    await page.mouse.down();
    await page.mouse.move(100, 400, { steps: 10 });
    await page.mouse.up();
    
    // Verify chapter changed
    await expect(page.locator('[data-testid="current-chapter"]')).toContainText('Genesis 2');

    // 5. User uses pull to refresh
    await page.touchscreen.tap(200, 100);
    await page.mouse.move(200, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200, { steps: 10 });
    await page.mouse.up();
    
    // Should see refresh indicator
    await expect(page.locator('[data-testid="refresh-indicator"]')).toBeVisible();
  });

  test('Performance meets requirements', async ({ page }) => {
    // Start performance monitoring
    await page.goto('/');
    
    // Measure page load time
    const loadTime = await page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });
    
    expect(loadTime).toBeLessThan(3000); // Less than 3 seconds

    // Measure First Contentful Paint
    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            resolve(fcpEntry.startTime);
          }
        }).observe({ entryTypes: ['paint'] });
      });
    });
    
    expect(fcp).toBeLessThan(2000); // Less than 2 seconds

    // Test navigation speed
    const startTime = Date.now();
    await page.goto('/bible-enhanced');
    await page.waitForLoadState('networkidle');
    const navigationTime = Date.now() - startTime;
    
    expect(navigationTime).toBeLessThan(1000); // Less than 1 second
  });
});