import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function finishQuiz(page: Page) {
  await page.goto('/tema/clima-vegetacao/quiz');
  for (let i = 0; i < 3; i++) { await page.locator('.answer').nth(i).tap(); await page.getByRole('button', { name: i === 2 ? 'Ver resultado' : 'Próxima pergunta' }).click(); }
  await expect(page.locator('.score-display')).toContainText('3/3');
}
async function registerVisit(page: Page, name: string) {
  await page.getByRole('link', { name: 'Encerrar visita e ver ranking' }).click();
  await expect(page.locator('.visit-stats')).toContainText('de 3 respondidas');
  await page.getByLabel('Primeiro nome ou apelido', { exact: true }).fill(name);
  await page.getByRole('checkbox', { name: 'Quero exibir este nome' }).check();
  await page.getByRole('button', { name: 'Salvar visita no ranking' }).tap();
  await expect(page.locator('.ranking-success')).toContainText('3 acertos');
}
test('fim da visita: opt-in, acertos, persistência, nova pessoa e inscrição única', async ({ page, context }) => {
  await finishQuiz(page); await registerVisit(page, 'Ana Sol');
  await expect(page.locator('.leaderboard-table tbody tr')).toHaveCount(1);
  await page.getByRole('link', { name: 'Encerrar minha visita' }).click();
  await expect(page.locator('.ranking-saved')).toContainText('já foi registrada');
  await expect(page.getByRole('button', { name: 'Salvar visita no ranking' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Ver ranking', exact: true }).click(); await page.reload();
  await expect(page.locator('.leaderboard-table tbody')).toContainText('Ana Sol');
  await page.getByRole('button', { name: 'Iniciar próxima visita', exact: true }).click();
  await expect(page).toHaveURL(/boas-vindas$/); await page.getByRole('link', { name: 'Toque para explorar' }).click();
  await expect(page.locator('.card-complete')).toHaveCount(0);
  await page.getByRole('link', { name: 'Ranking', exact: true }).click();
  await expect(page.locator('.leaderboard-table tbody tr')).toHaveCount(1);
  await finishQuiz(page); await registerVisit(page, 'Bento');
  await expect(page.locator('.leaderboard-table tbody tr')).toHaveCount(2);
  await page.reload(); await page.close(); const reopened = await context.newPage(); await reopened.goto('/ranking');
  await expect(reopened.locator('.leaderboard-table tbody')).toContainText('Ana Sol'); await expect(reopened.locator('.leaderboard-table tbody')).toContainText('Bento');
});
test('participação opcional e nenhum nome salvo ao encerrar sem participar', async ({ page }) => {
  await page.goto('/ranking'); await expect(page.getByRole('heading', { name: 'A primeira descoberta pode ser sua.' })).toBeVisible();
  await page.goto('/fim-da-visita'); await expect(page.getByRole('button', { name: 'Salvar visita no ranking' })).toHaveCount(0);
  await finishQuiz(page); await page.getByRole('link', { name: 'Encerrar visita e ver ranking' }).click();
  await page.getByLabel('Primeiro nome ou apelido', { exact: true }).fill('Não salvar');
  await page.getByRole('button', { name: 'Encerrar sem participar' }).click();
  await page.goto('/ranking'); await expect(page.locator('.leaderboard-table')).toHaveCount(0);
});
test('ranking offline: salvar, reiniciar a visita e recarregar sem rede', async ({ page, context }) => {
  await page.goto('/'); await expect(page.getByRole('status').filter({ hasText: 'Pronto para usar offline' })).toBeVisible({ timeout: 30000 }); await page.reload();
  await context.setOffline(true); await finishQuiz(page); await registerVisit(page, 'Mandacaru');
  await page.getByRole('button', { name: 'Iniciar próxima visita', exact: true }).click();
  await page.goto('/ranking'); await page.reload(); await expect(page.locator('.leaderboard-table tbody')).toContainText('Mandacaru');
  await context.setOffline(false);
});
test('erro de armazenamento não bloqueia a visita nem exibe sucesso falso', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Quota exceeded', 'QuotaExceededError'); }; });
  await finishQuiz(page); await page.getByRole('link', { name: 'Encerrar visita e ver ranking' }).click();
  await page.getByLabel('Primeiro nome ou apelido', { exact: true }).fill('Ana'); await page.getByRole('checkbox', { name: 'Quero exibir este nome' }).check();
  await page.getByRole('button', { name: 'Salvar visita no ranking' }).click();
  await expect(page.getByRole('alert')).toContainText('Não foi possível salvar'); await expect(page.locator('.ranking-success')).toHaveCount(0);
  await page.getByRole('button', { name: 'Encerrar sem participar' }).click(); await expect(page).toHaveURL(/boas-vindas$/);
});
test('limpeza do ranking pede confirmação e preserva o restante do museu', async ({ page }) => {
  await finishQuiz(page); await registerVisit(page, 'Teste de limpeza');
  await page.getByRole('button', { name: 'Opções de exibição' }).click(); await page.locator('.ranking-settings summary').click();
  page.once('dialog', dialog => dialog.dismiss()); await page.getByRole('button', { name: 'Apagar ranking deste navegador' }).click();
  await expect(page.locator('.leaderboard-table tbody tr')).toHaveCount(1);
  page.once('dialog', dialog => dialog.accept()); await page.getByRole('button', { name: 'Apagar ranking deste navegador' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Ranking deste navegador apagado.' })).toBeVisible();
  await page.getByRole('button', { name: 'Fechar opções' }).click(); await expect(page.locator('.leaderboard-table')).toHaveCount(0);
  await page.getByRole('link', { name: 'Explorar temas' }).click(); await expect(page.locator('.theme-card')).toHaveCount(6);
});
test('ranking e formulário são acessíveis e cabem em totem e celular', async ({ page }) => {
  await finishQuiz(page); await page.getByRole('link', { name: 'Encerrar visita e ver ranking' }).click();
  for (const [width, height] of [[1920,1080], [390,844]]) {
    await page.setViewportSize({ width, height });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze(); expect(result.violations).toEqual([]);
    await page.screenshot({ path: `test-results/visit-end-${width}.png`, fullPage: true });
  }
  await page.getByLabel('Primeiro nome ou apelido', { exact: true }).fill('Aluno Teste'); await page.getByRole('checkbox', { name: 'Quero exibir este nome' }).check(); await page.getByRole('button', { name: 'Salvar visita no ranking' }).click();
  for (const [width, height] of [[1920,1080], [390,844]]) {
    await page.setViewportSize({ width, height }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze(); expect(result.violations).toEqual([]);
    await page.screenshot({ path: `test-results/ranking-${width}.png`, fullPage: true });
  }
});