import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import content from '../src/content/modules.json' with { type: 'json' };
const slug = (id: string) => id === 'clima' ? 'clima-vegetacao' : id;
async function noOverflow(page: Page) { expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
test('seis percursos completos: 30 slides e 18 respostas corretas', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await expect(page.locator('.theme-card')).toHaveCount(6);
  await page.screenshot({ path: 'test-results/home-1920.png', fullPage: true });
  for (const m of content.modules) {
    await page.locator(`a.theme-card[href="/tema/${slug(m.id)}"]`).click();
    for (const [i, s] of m.slides.entries()) { await expect(page.getByRole('heading', { level: 1 })).toHaveText(s.title); await expect(page.locator('.slide-progress')).toContainText(`${i + 1} de 5`); if (i < 4) await page.getByRole('button', { name: 'Próximo', exact: true }).click(); }
    await page.getByRole('link', { name: 'Começar quiz' }).click();
    for (const [i, q] of m.quiz.entries()) { await expect(page.getByRole('heading', { level: 1 })).toHaveText(q.question); await page.locator('.answer').nth(q.correctIndex).tap(); await expect(page.locator('.answer:disabled')).toHaveCount(4); await expect(page.getByRole('status').filter({ hasText: 'Isso mesmo!' })).toBeVisible(); await page.getByRole('button', { name: i === 2 ? 'Ver resultado' : 'Próxima pergunta' }).click(); }
    await expect(page.locator('.score-display')).toContainText('300'); await expect(page.locator('.score-display')).toContainText('3/3'); await page.getByRole('link', { name: 'Voltar aos temas' }).first().click();
  }
  expect(errors).toEqual([]); await expect(page.locator('.card-complete')).toHaveCount(6); await noOverflow(page);
});
test('erro, pontuação parcial, voltar e refazer', async ({ page }) => {
  await page.goto('/tema/clima-vegetacao'); await page.getByRole('button', { name: 'Próximo', exact: true }).click(); await page.getByRole('link', { name: 'Voltar aos temas' }).first().click(); await page.locator('.theme-card').first().click(); await expect(page.locator('.slide-progress')).toContainText('2 de 5');
  await page.goto('/tema/clima-vegetacao/quiz');
  for (let i = 0; i < 3; i++) { await page.locator('.answer').nth(i === 0 ? 1 : content.modules[0].quiz[i].correctIndex).click(); if (!i) await expect(page.getByRole('status').filter({ hasText: 'Resposta correta: Caatinga' })).toBeVisible(); await page.getByRole('button', { name: i === 2 ? 'Ver resultado' : 'Próxima pergunta' }).click(); }
  await expect(page.locator('.score-display')).toContainText('200'); await page.getByRole('link', { name: 'Refazer quiz' }).click(); await expect(page.locator('.answer:not(:disabled)')).toHaveCount(4); await expect(page.locator('.quiz-bottom')).toContainText('0 pontos');
});
test('painéis literários, fontes e retorno preservado', async ({ page }) => {
  await page.goto('/tema/ariano'); await page.getByRole('button', { name: 'Próximo', exact: true }).click(); await page.locator('.literature-links summary').click(); await page.getByRole('link', { name: 'Auto da Compadecida' }).click(); await expect(page.getByText('PARÁFRASE EDUCATIVA — NÃO É CITAÇÃO DA OBRA')).toBeVisible(); await expect(page.locator('blockquote')).toHaveCount(0); await expect(page.getByText('Não sei, só sei que foi assim.')).toHaveCount(0); await page.getByRole('link', { name: 'Retornar ao post' }).first().click(); await expect(page.locator('.slide-progress')).toContainText('2 de 5');
});
test('quatro fases e seis marcos com controle manual', async ({ page }) => {
  await page.goto('/tema/clima-vegetacao/caatinga'); for (const name of ['Seca', 'Nuvens', 'Chuva', 'Renascimento']) { const b = page.getByRole('button', { name, exact: true }); await b.tap(); await expect(b).toHaveAttribute('aria-pressed', 'true'); await expect(page.locator('.landscape-label')).toContainText(name); }
  await page.goto('/linha-do-tempo'); const buttons = page.locator('.timeline-rail button'); await expect(buttons).toHaveCount(6); for (let i = 0; i < 6; i++) { await buttons.nth(i).click(); await expect(buttons.nth(i)).toHaveAttribute('aria-pressed', 'true'); } await expect(page.locator('.timeline-event')).toContainText('2014');
});
test('touch swipe e teclado', async ({ page }) => {
  await page.goto('/tema/cultura'); const section = page.locator('.slide-layout'); await section.dispatchEvent('touchstart', { changedTouches: [{ identifier: 0, clientX: 850, clientY: 300 }] }); await section.dispatchEvent('touchend', { changedTouches: [{ identifier: 0, clientX: 300, clientY: 310 }] }); await expect(page.locator('.slide-progress')).toContainText('2 de 5'); const previous = page.getByRole('button', { name: 'Anterior', exact: true }); await previous.focus(); await page.keyboard.press('Enter'); await expect(page.locator('.slide-progress')).toContainText('1 de 5'); await page.getByRole('button', { name: 'Opções de exibição' }).click(); await expect(page.getByRole('dialog')).toBeVisible(); await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('offline real: precache, fechar página, reabrir rota interna e quiz sem rede', async ({ page, context }) => {
  await page.goto('/'); await expect(page.getByRole('status').filter({ hasText: 'Pronto para usar offline' })).toBeVisible({ timeout: 30000 }); await page.evaluate(async () => { await navigator.serviceWorker.ready; }); await page.reload(); await context.setOffline(true); await page.close(); const offline = await context.newPage(); await offline.goto('/tema/ariano'); await expect(offline.getByRole('heading', { level: 1 })).toHaveText('Quem foi Ariano?');
  for (const m of content.modules) { await offline.goto(`/tema/${slug(m.id)}`); await expect(offline.locator('.slide-art img')).toBeVisible(); expect(await offline.locator('.slide-art img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true); }
  await offline.goto('/tema/cultura/quiz'); for (const [i, q] of content.modules[1].quiz.entries()) { await offline.locator('.answer').nth(q.correctIndex).tap(); await offline.getByRole('button', { name: i === 2 ? 'Ver resultado' : 'Próxima pergunta' }).click(); } await expect(offline.locator('.score-display')).toContainText('300'); await context.setOffline(false);
});
test('responsivo: 1920, 4K, tablet e celular sem overflow', async ({ page }) => {
  for (const [width, height] of [[1920,1080],[3840,2160],[1024,768],[390,844]]) { await page.setViewportSize({ width, height }); await page.goto('/'); await expect(page.locator('.theme-card')).toHaveCount(6); await noOverflow(page); await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true }); await page.goto('/tema/ariano'); await noOverflow(page); await page.screenshot({ path: `test-results/module-${width}.png`, fullPage: true }); }
});
test('acessibilidade automatizada nas telas principais', async ({ page }) => {
  for (const path of ['/', '/tema/ariano', '/tema/ariano/quiz', '/tema/ariano/leitura/auto', '/tema/clima-vegetacao/caatinga', '/linha-do-tempo', '/sobre']) { await page.goto(path); await page.evaluate(() => document.fonts.ready); const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze(); expect(results.violations, JSON.stringify(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })))).toEqual([]); }
});
test('modo quiosque avisa antes de reiniciar e permite continuar a leitura', async ({ page }) => {
  await page.clock.install();
  await page.goto('/tema/cultura');
  await page.getByRole('button', { name: 'Opções de exibição' }).click();
  await page.getByRole('checkbox', { name: 'Reduzir animações' }).check();
  await page.getByLabel('Retorno por inatividade').selectOption('3');
  await page.getByRole('button', { name: 'Fechar opções' }).click();
  await expect(page.locator('.app')).toHaveClass(/reduce-motion/);
  await page.clock.fastForward(181000);
  await expect(page.getByRole('alert')).toContainText('inatividade');
  await page.getByRole('button', { name: 'Continuar explorando' }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page).toHaveURL(/tema\/cultura$/);
  await page.clock.fastForward(181000);
  await expect(page.getByRole('alert')).toBeVisible();
  await page.clock.fastForward(31000);
  await expect(page).toHaveURL(/boas-vindas$/);
  await expect(page.getByRole('link', { name: 'Toque para explorar' })).toBeVisible();
});
