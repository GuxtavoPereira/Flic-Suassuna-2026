import { expect, type Page } from '@playwright/test';
import pool from '../src/content/pools.json' with { type: 'json' };
export async function readTheme(page: Page, id: string, navigate = true) {
  if (navigate) await page.goto(`/tema/${id}`);
  for (let i = 0; i < 5; i++) {
    await expect(page.locator('.slide-progress')).toContainText(`${i + 1} de 5`);
    const title = await page.getByRole('heading', { level: 1 }).innerText();
    expect(pool.posts.some(p => p.themeId === id && p.title === title)).toBe(true);
    await expect(page.locator('.slide-art img')).toBeVisible();
    if (i < 4) await page.getByRole('button', { name: 'Próximo', exact: true }).click();
  }
  await page.getByRole('link', { name: 'Começar quiz' }).click();
  await expect(page.locator('.quiz-count')).toBeVisible();
}
export async function answerQuiz(page: Page, wrongFirst = false) {
  for (let i = 0; i < 3; i++) {
    await expect(page.locator('.quiz-count')).toHaveText(`Pergunta ${i + 1} de 3`);
    const title = await page.locator('.quiz-content h1').innerText();
    const q = pool.questions.find(q => q.question === title);
    if (!q) throw new Error(`Unknown question: ${title}`);
    const answer = wrongFirst && i === 0 ? q.options[(q.correctIndex + 1) % 4] : q.options[q.correctIndex];
    await page.getByRole('button', { name: new RegExp(answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).tap();
    await expect(page.locator('.answer:disabled')).toHaveCount(4);
    await expect(page.locator('.quiz-feedback')).toBeVisible();
    await page.getByRole('button', { name: i === 2 ? 'Ver resultado' : 'Próxima pergunta' }).click();
    if (i === 2) await expect(page.locator('.score-display')).toBeVisible();
  }
}
