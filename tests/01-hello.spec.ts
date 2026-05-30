import { test, expect } from '@playwright/test';

/**
 * 第一课：最小可运行用例
 * - 打开页面
 * - 找元素（role / text 比 xpath 更稳）
 * - 断言
 */
test('Playwright 官网标题包含 Playwright', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await expect(page).toHaveTitle(/Playwright/);
  await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
});
