import { expect, Locator, Page } from '@playwright/test';

/**
 * Page Object：把「页面长什么样、怎么操作」封装起来，测试用例只写业务意图。
 */
export class TodoPage {
  readonly page: Page;
  readonly input: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-item');
    this.todoCount = page.getByTestId('todo-count');
  }

  async goto() {
    await this.page.goto('/todomvc');
  }

  async addTodo(title: string) {
    await this.input.fill(title);
    await this.input.press('Enter');
  }

  async expectTodoVisible(title: string) {
    await expect(this.todoItems.filter({ hasText: title })).toBeVisible();
  }

  async expectRemainingCount(count: number) {
    await expect(this.todoCount).toContainText(String(count));
  }

  async markFirstTodoCompleted() {
    await this.todoItems.first().getByRole('checkbox').check();
  }
}
