import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readTheme, answerQuiz } from './helpers';
test.use({ serviceWorkers: 'block' });
test('quiz só começa depois dos posts; ordem e respostas sobrevivem à recarga', async ({ page }) => {
  await page.goto('/tema/culinaria/quiz'); await expect(page.getByRole('heading',{name:'Primeiro, explore as descobertas.'})).toBeVisible();
  await readTheme(page,'culinaria'); const title=await page.locator('h1').innerText();const options=await page.locator('.answer').allTextContents();
  await page.locator('.answer').first().click(); await page.reload();
  expect(await page.locator('h1').innerText()).toBe(title);expect(await page.locator('.answer').allTextContents()).toEqual(options);await expect(page.locator('.answer:disabled')).toHaveCount(4);
});
test('nova visita muda os posts; treino muda conteúdos sem melhorar ranking', async ({ page }) => {
  await readTheme(page,'culinaria'); await answerQuiz(page,true); await expect(page.locator('.score-display')).toContainText('2/3');
  const before=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('flic-visit-v2')!).rounds.culinaria);
  await page.getByRole('link',{name:'Nova rodada de treino'}).click();
  await expect(page.locator('.slide-progress')).toContainText('1 de 8');
  await readTheme(page,'culinaria',false);await answerQuiz(page);
  await expect(page.locator('.score-display')).toContainText('3/3');await expect(page.getByText('Resultado de treino.')).toBeVisible();
  await page.getByRole('link',{name:'Encerrar visita e ver ranking'}).click();await expect(page.locator('.visit-stats dd').first()).toContainText('2');
  const after=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('flic-visit-v2')!).rounds.culinaria);
  expect(after.postIds).not.toEqual(before.postIds);expect(after.rankingAnswers).toEqual(before.rankingAnswers);
  await page.getByRole('button',{name:'Encerrar sem participar'}).click();
  await page.getByRole('link',{name:'Toque para explorar'}).click();
  expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('flic-visit-v2')!).visitId)).toBeTruthy();
});
test('créditos de imagens, fallback e registro documental sem citações liberadas', async ({ page }) => {
  await page.goto('/tema/ariano/leitura/santo');await expect(page.locator('.literary-book .post-image figcaption')).toContainText('Retrato contextual');
  await page.locator('.literary-book .image-credit summary').click();await expect(page.locator('.literary-book .image-credit a').first()).toHaveAttribute('href',/commons.wikimedia.org/);
  await expect(page.locator('blockquote')).toHaveCount(0);
  await page.route('**/images/topics/**',route=>route.abort());await page.goto('/tema/culinaria');await expect(page.locator('.artwork-fallback')).toBeVisible();
  await page.getByRole('button',{name:'Próximo',exact:true}).click();await expect(page.locator('h1')).toBeVisible();
});
test('primeira abertura local sem nenhuma requisição externa', async ({ page, context }) => {
  const external: string[]=[];
  await context.route('**/*',route=>{const url=new URL(route.request().url());if(['127.0.0.1','localhost'].includes(url.hostname))return route.continue();external.push(url.href);return route.abort();});
  await readTheme(page,'culinaria');await answerQuiz(page);await expect(page.locator('.score-display')).toContainText('300');expect(external).toEqual([]);
});

test('quiz dinâmico acessível em display e celular', async ({ page }) => {
  await readTheme(page,'ariano');
  for (const [width,height] of [[1920,1080],[390,844]]) {
    await page.setViewportSize({width,height});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);
    await page.screenshot({path:`test-results/dynamic-quiz-${width}.png`,fullPage:true});
  }
});

test('fotos reais prevalecem nos posts e painéis de obras', async ({ page }) => {
  await page.goto('/tema/clima-vegetacao');await expect(page.locator('.slide-art img')).not.toHaveAttribute('src',/fornecidas/);
  await page.goto('/tema/cultura');await expect(page.locator('.slide-art img')).toHaveAttribute('src','/images/topics/repente.webp');
  await page.goto('/tema/cultura/leitura/pedra');await expect(page.locator('.literary-book img')).toHaveAttribute('src','/images/documentary/pedra-do-reino-local.webp');
  await expect(page.locator('.literary-book figcaption')).not.toContainText('gerada por IA');
});
