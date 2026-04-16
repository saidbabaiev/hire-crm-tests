import { test, expect } from '@playwright/test';

test.describe('Страница авторизации (Auth)', () => {

  // Тест 1: Успешный сценарий (Happy Path)
  test('Успешный логин перенаправляет на защищенную страницу', async ({ page }) => {
    await page.goto('/auth');

    // Заполняем правильные данные (замени на реального тестового юзера в своей БД)
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('real-password-123');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    // ПРОВЕРКА 1: Проверяем, что URL изменился
    // Playwright сам дождется, пока роутер или сервер сделают редирект
    await expect(page).toHaveURL('/dashboard'); // Замени на свой URL

    // ПРОВЕРКА 2: Ищем элемент, который есть ТОЛЬКО после логина
    // Это защита от ложноположительных тестов, если URL изменился, а страница пустая
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible(); 
  });

  // Тест 2: Негативный сценарий (Negative Path)
  test('Показ ошибки при вводе неверных данных', async ({ page }) => {
    await page.goto('/auth');

    // Вводим заведомо неверные данные
    await page.getByLabel('Email').fill('fake@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    // ПРОВЕРКА: Убеждаемся, что URL НЕ изменился
    await expect(page).toHaveURL('/auth');

    // ПРОВЕРКА: Ищем текст ошибки от бэкенда
    const errorMessage = page.getByText('Invalid credentials'); // Замени на реальный текст твоей ошибки
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

    // 2. Идем на страницу и пробуем залогиниться
    await page.goto('/auth');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    // 3. ПРОВЕРКА: Ищем тост с нашей искусственной ошибкой
    // Поскольку тост появляется динамически, Playwright будет ждать его появления (Auto-waiting)
    const errorToast = page.getByText('Критическая ошибка: База данных недоступна'); 
    await expect(errorToast).toBeVisible();
  });

});
