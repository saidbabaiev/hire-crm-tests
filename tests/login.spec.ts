import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Страница авторизации (Auth) - POM', () => {

    // Тест 1: Успешный сценарий (Happy Path)
    test('Успешный логин перенаправляет на защищенную страницу', async ({ page }) => { 
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.login('tester@example.com', 'tester123');

        // 3. Проверки (Ассерты) оставляем в самом тесте! Это важное правило POM: класс страницы делает действия, а тест делает проверки.
        await expect(page).toHaveURL('/dashboard');
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    })

    // Тест 2: Негативный сценарий (Negative Path)
    test('Показ ошибки при вводе неверных данных', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.login('fake-user@example.com', 'wrongpassword');

        // ПРОВЕРКА: Убеждаемся, что URL НЕ изменился
        await expect(page).toHaveURL('/auth');

        // ПРОВЕРКА: Ищем текст ошибки от бэкенда
        const errorMessage = page.getByText('Invalid credentials');
        await expect(errorMessage).toBeVisible();
    });


    // Тест 3: Мокирование Supabase (Имитация падения сервера)
  test('Обработка ошибки от Supabase и показ тоста', async ({ page }) => {
    
    // 1. ПЕРЕХВАТ: Ловим запрос к Supabase Auth
    // Звездочки означают: любой домен до и любые параметры после
    await page.route('**/auth/v1/token**', async route => {
      
      // Отвечаем фронтенду так, будто база данных упала или юзер заблокирован
      await route.fulfill({
        status: 400, // Supabase обычно кидает 400 на ошибки авторизации
        contentType: 'application/json',
        // Имитируем структуру ответа Supabase GoTrue
        body: JSON.stringify({ 
          error: 'invalid_grant',
          error_description: 'Критическая ошибка: База данных недоступна' // Этот текст пойдет в toast
        }),
      });
    });

    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('tester@example.com', 'tester123');

    // 3. ПРОВЕРКА: Ищем тост с нашей искусственной ошибкой
    // Поскольку тост появляется динамически, Playwright будет ждать его появления (Auto-waiting)
    const errorToast = page.getByText('Критическая ошибка: База данных недоступна'); 
    await expect(errorToast).toBeVisible();
  });

});
