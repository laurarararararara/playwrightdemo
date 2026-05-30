import { expect, Locator, Page } from '@playwright/test';

export class DemoPage {
  readonly page: Page;
  readonly logo: Locator;
  readonly heroImage: Locator;
  readonly heroStatus: Locator;
  readonly counterValue: Locator;
  readonly cartItems: Locator;
  readonly cartEmpty: Locator;
  readonly welcomeModal: Locator;
  readonly toast: Locator;
  readonly formResult: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByTestId('site-logo');
    this.heroImage = page.getByTestId('hero-image');
    this.heroStatus = page.getByTestId('hero-status');
    this.counterValue = page.getByTestId('counter-value');
    this.cartItems = page.getByTestId('cart-items');
    this.cartEmpty = page.getByTestId('cart-empty');
    this.welcomeModal = page.getByTestId('welcome-modal');
    this.toast = page.getByTestId('toast');
    this.formResult = page.getByTestId('form-result');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickStartExploring() {
    await this.page.getByRole('button', { name: '开始探索' }).click();
  }

  async openWelcomeModal() {
    await this.page.getByRole('button', { name: '打开欢迎弹窗' }).click();
  }

  async closeWelcomeModal() {
    await this.page.getByRole('button', { name: '知道了' }).click();
  }

  async incrementCounter(times = 1) {
    const plus = this.page.getByRole('button', { name: '增加' });
    for (let i = 0; i < times; i += 1) {
      await plus.click();
    }
  }

  async addProductToCart(name: string) {
    await this.page
      .getByTestId('product-card')
      .filter({ hasText: name })
      .getByRole('button', { name: '加入购物车' })
      .click();
  }

  async submitContactForm(data: { name: string; email: string; message: string; topic?: string }) {
    await this.page.getByPlaceholder('怎么称呼你').fill(data.name);
    await this.page.getByPlaceholder('you@example.com').fill(data.email);
    if (data.topic) {
      await this.page.locator('select[name="topic"]').selectOption(data.topic);
    }
    await this.page.getByPlaceholder('写点什么…').fill(data.message);
    await this.page.getByRole('button', { name: '发送消息' }).click();
  }

  async expectCounter(value: number) {
    await expect(this.counterValue).toHaveText(String(value));
  }

  async expectCartContains(...items: string[]) {
    await expect(this.cartEmpty).toBeHidden();
    await expect(this.cartItems.getByTestId('cart-item')).toHaveText(items);
  }
}
