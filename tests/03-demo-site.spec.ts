import { test, expect } from '@playwright/test';
import { DemoPage } from '../pages/DemoPage';

/**
 * 第三课：本地练习站 — 图片、按钮、表单、弹窗、购物车
 * 先手动打开页面：npm run site
 * 有界面跑测试：npm run test:headed -- tests/03-demo-site.spec.ts
 */
test.describe('本地练习站', () => {
  test.use({ baseURL: 'http://127.0.0.1:4173' });

  test('首页图片与主按钮可见', async ({ page }) => {
    const demo = new DemoPage(page);
    await demo.goto();

    await expect(page).toHaveTitle(/Playwright 练习站/);
    await expect(demo.logo).toBeVisible();
    await expect(demo.heroImage).toBeVisible();
    await expect(page.getByRole('button', { name: '开始探索' })).toBeEnabled();
    await expect(page.getByRole('img', { name: '复古相机' })).toBeVisible();
  });

  test('点击开始探索会更新状态并显示 Toast', async ({ page }) => {
    const demo = new DemoPage(page);
    await demo.goto();

    await demo.clickStartExploring();
    await expect(demo.heroStatus).toContainText('开始探索');
    await expect(demo.toast).toContainText('已跳转到商品区');
  });

  test('计数器与购物车按钮联动', async ({ page }) => {
    const demo = new DemoPage(page);
    await demo.goto();

    await demo.incrementCounter(3);
    await demo.expectCounter(3);

    await demo.addProductToCart('复古相机');
    await demo.addProductToCart('无线耳机');
    await demo.expectCartContains('复古相机', '无线耳机');

    await page.getByRole('button', { name: '清空购物车' }).click();
    await expect(demo.cartEmpty).toBeVisible();
  });

  test('欢迎弹窗可打开并关闭', async ({ page }) => {
    const demo = new DemoPage(page);
    await demo.goto();

    await demo.openWelcomeModal();
    await expect(demo.welcomeModal).toBeVisible();
    await expect(demo.welcomeModal.getByRole('heading', { name: '欢迎来到本地练习站' })).toBeVisible();

    await demo.closeWelcomeModal();
    await expect(demo.welcomeModal).toBeHidden();
  });

  test('联系表单提交后显示感谢信息', async ({ page }) => {
    const demo = new DemoPage(page);
    await demo.goto();

    await page.getByRole('button', { name: '联系' }).click();
    await demo.submitContactForm({
      name: '小明',
      email: 'demo@example.com',
      message: '我想练习 Playwright 表单操作',
      topic: 'learn',
    });

    await expect(demo.formResult).toContainText('感谢 小明');
    await expect(demo.toast).toContainText('表单提交成功');
  });
});
