import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

/**
 * 第二课：官方 TodoMVC demo + Page Object
 * baseURL 已在 playwright.config.ts 里配置为 demo.playwright.dev
 */
test.describe('TodoMVC', () => {
  test('添加两条待办并校验剩余数量', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    await todo.addTodo('学习 Playwright 定位');
    await todo.addTodo('写一个 Page Object');
    await todo.expectTodoVisible('学习 Playwright 定位');
    await todo.expectRemainingCount(2);
  });

  test('勾选第一条后，Active 列表少一条', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    await todo.addTodo('买咖啡');
    await todo.addTodo('写 demo');
    await todo.markFirstTodoCompleted();

    // 点 Active 过滤，只剩未完成的
    await page.getByRole('link', { name: 'Active' }).click();
    await expect(todo.todoItems).toHaveCount(1);
    await expect(todo.todoItems).toHaveText('写 demo');
  });
});
