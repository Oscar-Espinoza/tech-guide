import { expect, test } from '@playwright/test';

test('all public routes render with semantic landmarks', async ({ page }) => {
  for (const route of [
    '/',
    '/concepts/',
    '/concepts/postgresql-vs-mongodb/',
    '/search/',
    '/about/',
    '/es/',
  ]) {
    const response = await page.goto(route);
    expect(response?.ok(), route).toBeTruthy();
    await expect(page.locator('header.site-header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  }
});

test('concept page has metadata, readable diagrams, and Spanish fallback', async ({
  page,
}) => {
  await page.goto('/concepts/postgresql-vs-mongodb/');
  await expect(page).toHaveTitle(/PostgreSQL vs MongoDB/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/concepts\/postgresql-vs-mongodb\/$/,
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    'content',
    'article',
  );
  await expect(page.locator('article h1')).toHaveText('PostgreSQL vs MongoDB');
  await expect(page.locator('figure.diagram svg[role="img"]')).toHaveCount(2);
  await expect(
    page.getByRole('link', { name: 'Español', exact: true }),
  ).toHaveAttribute('href', '/es/');
});

test('theme initializes from storage and persists manual changes', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('sfg-theme', 'dark'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const themeToggle = page.getByRole('button', {
    name: 'Switch to light theme',
  });
  if (!(await themeToggle.isVisible())) {
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
  }
  await themeToggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('mobile navigation and table of contents are keyboard accessible', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/concepts/postgresql-vs-mongodb/');
  const menu = page.getByRole('button', { name: 'Toggle navigation' });
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  await expect(page.locator('.mobile-toc')).toBeVisible();
  await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'hidden');
});

test('library filters persist in the URL and show useful empty state', async ({
  page,
}) => {
  await page.goto('/concepts/');
  await page.locator('#category').selectOption('databases');
  await expect(page).toHaveURL(/category=databases/);
  await expect(page.locator('.concept-card:not([hidden])')).toHaveCount(1);
  await page.locator('#category').selectOption('architectures');
  await expect(page.locator('[data-empty]')).toBeVisible();
});

test('Pagefind searches the English guide and respects filters', async ({
  page,
}) => {
  await page.goto('/search/?q=PostgreSQL');
  await expect(page.locator('[data-search-status]')).toContainText(
    /result.*PostgreSQL/i,
  );
  await expect(page.locator('.search-result a')).toHaveAttribute(
    'href',
    /postgresql-vs-mongodb/,
  );
  await page.locator('#search-category').selectOption('architectures');
  await expect(page.locator('[data-search-status]')).toContainText('0 results');
  await expect(page.locator('[data-search-results]')).not.toContainText(
    'draft fixture',
  );
});

test('slash focuses search and the custom 404 is emitted', async ({ page }) => {
  await page.goto('/search/');
  await page.keyboard.press('/');
  await expect(page.locator('#query')).toBeFocused();
  const response = await page.goto('/404.html');
  expect(response?.ok()).toBeTruthy();
  await expect(
    page.getByRole('heading', { name: 'That path ends here.' }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow',
  );
});

test('robots and sitemap are emitted', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('sitemap-index.xml');
  const sitemap = await request.get('/sitemap-index.xml');
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain('sitemap-0.xml');
});
