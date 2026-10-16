import { log } from 'node:console';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
const read = p=>JSON.parse(readFileSync(p,'utf8'));
const pool=read('src/content/pools.json');
const assets=['topic','documentary','evolution','supplied'].flatMap(c=>read(`src/content/${c}-assets.json`));
const sourceIds=new Set([...read('src/content/editorial-sources.json').map(s=>s.id),'caatinga','embrapa','embrapa-umbu','embrapa-rapadura','cordel','forro','rachel-bio','gonzaga-bio','vitalino-bio','patativa-bio','fundaj-comida','canudos','abl-bio','abl-obras','fundaj','usp']);
const manifest=pool.posts.map(p=>{
  const a=assets.find(a=>a.id===p.assetId);
  if(!a||!existsSync(`public${a.image}`))throw Error(`Imagem local ausente: ${p.id}`);
  if(!p.source.length||p.source.some(id=>!sourceIds.has(id)))throw Error(`Fonte editorial órfã: ${p.id}`);
  if(p.themeId==='clima-vegetacao'&&/IA|sintétic/i.test(a.assetType))throw Error(`Imagem sintética no clima: ${p.id}`);
  return {postId:p.id,themeId:p.themeId,assetPath:a.image,subject:a.subject??a.caption,alt:a.alt,caption:[p.imageContext,a.caption].filter(Boolean).join(' '),creator:a.creator??a.credit,sourceUrl:a.sourceUrl,license:a.license??a.licenseNote,usagePermission:a.usagePermission??`Uso conforme licença registrada: ${a.licenseNote}`,place:a.place??'Não informado na ficha local; conferir fonte individual',date:a.date??'Não informada na ficha local; conferir fonte individual',assetType:a.assetType,editorialStatus:p.imageContext?.includes('pendente')?'context-photo-pending':a.editorialStatus??'source-license-recorded; pedagogical-review-pending',editorialSource:p.source};
});
mkdirSync('public/content',{recursive:true});
writeFileSync('public/content/image-manifest.json',JSON.stringify({version:3,generatedAt:'2026-10-16',posts:manifest},null,2)+'\n');
const escape=s=>String(s).replaceAll('|','/').replaceAll('\n',' ');
writeFileSync('IMAGENS-POR-POST.md','# Imagens por post — edição de revisão\n\nFonte/legenda não equivalem à aprovação editorial. Pendências em PENDENCIAS-CURADORIA.md.\n\n| Post | Imagem local | Fonte | Licença / situação |\n| --- | --- | --- | --- |\n'+manifest.map(p=>`| ${p.postId} | ${p.assetPath} | ${p.sourceUrl} | ${escape(p.license)} · ${p.editorialStatus} |`).join('\n')+'\n');
log(`Conteúdo validado: ${manifest.length} posts, ${new Set(manifest.map(p=>p.themeId)).size} temas, imagens/fontes locais presentes.`);
