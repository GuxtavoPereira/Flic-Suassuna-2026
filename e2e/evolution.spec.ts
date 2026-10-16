import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync, writeFileSync } from 'node:fs';
async function findPost(page:Page,id:string,title:string){
  await page.goto(`/tema/${id}`);
  for(let i=0;i<16;i++){
    if(await page.locator('.slide-copy h1').innerText()===title)return;
    const next=page.getByRole('button',{name:'Próximo',exact:true});
    if(!await next.count())break;
    const before=await page.locator('.slide-progress>span').innerText();await next.click();await expect(page.locator('.slide-progress>span')).not.toHaveText(before);
  }
  throw Error(`Post obrigatório não encontrado: ${title}`);
}
test('oito temas, título correto e percursos livres sem aumentar ranking',async({page})=>{
  await page.goto('/');await expect(page).toHaveTitle('O Sertão de Ariano Suassuna | FLIC 2026');await expect(page.locator('.home-intro h1')).toHaveText('O Sertão de Ariano Suassuna');await expect(page.locator('.theme-card')).toHaveCount(8);await expect(page.locator('a[href="/tema/festas-religiosidade"] .card-image img')).toHaveAttribute('src','/images/evolution/chapel.webp');
  for(const [id,total] of [['musica-audiovisual',10],['festas-religiosidade',11]] as const){
    await page.goto(`/tema/${id}`);
    for(let i=1;i<=total;i++){await expect(page.locator('.slide-progress')).toContainText(`Post ${i} de ${total}`);if(i<total)await page.getByRole('button',{name:'Próximo',exact:true}).click();}
    await expect(page.getByRole('link',{name:'Concluir percurso'})).toBeVisible();await expect(page.getByRole('link',{name:'Começar quiz'})).toHaveCount(0);
    await page.goto(`/tema/${id}/quiz`);await expect(page).toHaveURL(new RegExp(`/tema/${id}$`));
  }
  await page.goto('/fim-da-visita');await expect(page.getByRole('button',{name:'Salvar visita no ranking'})).toHaveCount(0);
});
test('mapas: camadas distintas, quatro painéis, toque e teclado sem rede',async({page,context})=>{
  await page.goto('/');await expect(page.getByRole('status').filter({hasText:'Pronto para usar offline'})).toBeVisible({timeout:30000});await page.reload();await context.setOffline(true);
  await page.goto('/tema/clima-vegetacao/mapas');await expect(page.locator('.territory-map')).toBeVisible();
  await page.getByRole('button',{name:'Bioma Caatinga · 2019',exact:true}).tap();await expect(page.locator('svg title').filter({hasText:'Bioma Caatinga'})).toHaveCount(1);
  await page.getByRole('button',{name:'Semiárido · recorte 2022',exact:true}).click();await expect(page.locator('svg title').filter({hasText:'1.477 municípios'})).toHaveCount(1);
  await page.getByRole('button',{name:'Quatro sub-regiões',exact:true}).click();
  for(const name of ['1. Meio-Norte','2. Sertão','3. Agreste','4. Zona da Mata']){const b=page.getByRole('button',{name,exact:true});await b.focus();await page.keyboard.press('Enter');await expect(b).toHaveAttribute('aria-pressed','true');await expect(page.locator('.region-panel')).toContainText(name.slice(3));}
  await page.getByRole('button',{name:'Selecionar Sertão: Salgueiro'}).tap();await expect(page.locator('.region-panel')).toContainText('Salgueiro');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'test-results/maps-1920.png',fullPage:true});
});
test('cisterna: diagrama, foto real e referências cruzadas',async({page})=>{
  await findPost(page,'clima-vegetacao','Chuva guardada para depois');await expect(page.locator('.slide-art img')).toHaveAttribute('src','/images/evolution/cisterna.webp');await expect(page.locator('.cistern-diagram')).toBeVisible();await page.screenshot({path:'test-results/cistern-1920.png',fullPage:true});await expect(page.locator('.economy-context')).toContainText('Consumo humano e produção');await page.getByRole('link',{name:'Alimentos e cotidiano',exact:true}).click();await expect(page).toHaveURL(/tema\/culinaria$/);
});
test('audiovisual offline usa QR local e preserva a exposição no totem',async({page,context})=>{
  await page.goto('/');await expect(page.getByRole('status').filter({hasText:'Pronto para usar offline'})).toBeVisible({timeout:30000});await page.reload();await context.setOffline(true);
  await findPost(page,'musica-audiovisual','Calango Lengo: animação e imaginação');await expect(page.locator('.video-reference')).toContainText('totem está offline');await expect(page.locator('.slide-art figcaption')).toContainText('Não é cartaz');
  await page.getByRole('button',{name:'Assistir no YouTube · pelo celular'}).click();await expect(page.locator('.video-qr')).toBeVisible();await page.screenshot({path:'test-results/video-qr-1920.png',fullPage:true});await expect(page.locator('.video-dialog')).toContainText('hj1fyV3pvSM');await expect(page.locator('video,iframe,a[href*="youtube.com"]')).toHaveCount(0);
  await page.getByRole('button',{name:'Voltar à exposição',exact:true}).click();await expect(page.getByRole('dialog')).not.toBeVisible();await expect(page.locator('.slide-copy h1')).toHaveText('Calango Lengo: animação e imaginação');
});
test('mapas e novos percursos: responsividade e acessibilidade',async({page})=>{
  for(const [width,height] of [[1920,1080],[1024,768],[390,844]]){
    await page.setViewportSize({width,height});
    for(const path of ['/','/tema/clima-vegetacao/mapas','/tema/festas-religiosidade','/tema/musica-audiovisual']){
      await page.goto(path);await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path).toBe(true);
      const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations,JSON.stringify(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))).toEqual([]);
      if(path.includes('festas-')||path.includes('musica-'))await page.screenshot({path:`test-results/${path.includes('festas-')?'festas':'musica'}-${width}.png`,fullPage:true});
    }
  }
});
test('atualização PWA aguarda a Home e conserva a visita',async({page})=>{
  const original=readFileSync('dist/sw.js','utf8');
  try{
    await page.goto('/');await expect(page.getByRole('status').filter({hasText:'Pronto para usar offline'})).toBeVisible({timeout:30000});await page.reload();await page.goto('/tema/cultura');
    const visit=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('flic-visit-v2')!).visitId);
    writeFileSync('dist/sw.js',original+'\n// e2e-update-2026\n');
    await page.evaluate(async()=>{const r=await navigator.serviceWorker.ready;await r.update();});
    await page.waitForFunction(async()=>Boolean((await navigator.serviceWorker.getRegistration())?.waiting));
    await expect(page.locator('.update-banner')).toHaveCount(0);await expect(page).toHaveURL(/tema\/cultura$/);
    await page.getByRole('link',{name:'Voltar aos temas',exact:true}).first().click();await expect(page.locator('.update-banner')).toBeVisible();await Promise.all([page.waitForEvent('load'),page.getByRole('button',{name:/Atualizar agora/}).click()]);await expect(page.locator('.theme-card')).toHaveCount(8);
    expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('flic-visit-v2')!).visitId)).toBe(visit);
  }finally{writeFileSync('dist/sw.js',original);}
});

test('display horizontal: oito cards em quatro colunas e QR local para o site', async ({page,context}) => {
  for (const [width,height] of [[1920,1080],[1366,768]]) {
    await page.setViewportSize({width,height});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
    const boxes=await page.locator('.theme-card').evaluateAll(cards=>cards.map(c=>{const r=c.getBoundingClientRect();return {top:r.top,bottom:r.bottom};}));
    expect(boxes).toHaveLength(8);expect(new Set(boxes.slice(0,4).map(b=>Math.round(b.top))).size).toBe(1);expect(new Set(boxes.slice(4).map(b=>Math.round(b.top))).size).toBe(1);expect(boxes[4].top).toBeGreaterThan(boxes[0].top);expect(Math.max(...boxes.map(b=>b.bottom))).toBeLessThanOrEqual(height);
    await page.screenshot({path:`test-results/home-horizontal-${width}.png`,fullPage:true});
  }
  await page.setViewportSize({width:1920,height:1080});await page.goto('/');await expect(page.getByRole('status').filter({hasText:'Pronto para usar offline'})).toBeVisible({timeout:30000});await page.reload();await context.setOffline(true);
  await page.getByRole('button',{name:'Ver site no celular',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Leve o sertão com você'});await expect(dialog).toBeVisible();await expect(dialog).toContainText('https://flic2026-sertao-guxtavopereira.vercel.app/');await expect(dialog).toContainText('celular precisa de internet');expect(await dialog.locator('img').evaluate((im:HTMLImageElement)=>im.complete&&im.naturalWidth>0)).toBe(true);await page.screenshot({path:'test-results/site-qr-1920.png',fullPage:true});await page.getByRole('button',{name:'Fechar QR code',exact:true}).click();await expect(dialog).not.toBeVisible();await expect(page).toHaveURL('/');
});
test('mapas touch: seleção do estado no desenho e quatro sub-regiões coloridas', async ({page}) => {
  await page.goto('/tema/clima-vegetacao/mapas');await page.getByRole('button',{name:'Paraíba',exact:true}).click();await expect(page.locator('[data-state="PB"]')).toHaveAttribute('aria-pressed','true');await expect(page.locator('.map-selection-status')).toContainText('Paraíba · PB');await expect(page.locator('.state-selection path')).toHaveCount(2);
  await page.getByRole('button',{name:'Selecionar estado Ceará',exact:true}).tap();await expect(page.locator('[data-state="CE"]')).toHaveAttribute('aria-pressed','true');await expect(page.locator('[data-state="PB"]')).toHaveAttribute('aria-pressed','false');await expect(page.locator('.map-state-list button').filter({hasText:'Ceará'})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Selecionar estado Pernambuco',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('.map-selection-status')).toContainText('Pernambuco · PE');await page.screenshot({path:'test-results/selected-state-1920.png',fullPage:true});
  await page.getByRole('button',{name:'Quatro sub-regiões',exact:true}).click();await expect(page.locator('[data-subregion]')).toHaveCount(4);expect(new Set(await page.locator('[data-subregion]').evaluateAll(paths=>paths.map(p=>p.getAttribute('fill')))).size).toBe(4);
  for(const name of ['1. Meio-Norte','2. Sertão','3. Agreste','4. Zona da Mata']) {await page.getByRole('button',{name,exact:true}).tap();await expect(page.locator('.region-panel h3')).toHaveText(name.slice(3));}
  await page.getByRole('button',{name:'Selecionar Sertão: Salgueiro',exact:true}).tap();await expect(page.locator('[data-subregion="sertao"]')).toHaveAttribute('aria-pressed','true');await expect(page.locator('.subregion-selection path')).toHaveCount(2);await page.screenshot({path:'test-results/subregions-1920.png',fullPage:true});
});
