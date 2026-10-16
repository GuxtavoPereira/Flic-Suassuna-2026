import { describe, expect, it, vi, afterEach } from 'vitest';
import { themes, sources } from '../content';
import { existsSync } from 'node:fs';
import video from '../content/videos.json';
import states from '../content/maps/states.json';
import semiarido from '../content/maps/semiarido.json';
import caatinga from '../content/maps/caatinga.json';
import localities from '../content/maps/localities.json';
import subregions from '../content/maps/subregions.json';
import site from '../content/site-links.json';
import { createSession, loadSession, persistSession, SESSION_KEY } from '../services/visit-session';
import { createRound } from './rotation';
import { summarizeVisit } from './visit';
function storage() { const map = new Map<string,string>(); return { getItem:(k:string)=>map.get(k)??null, setItem:(k:string,v:string)=>{map.set(k,v);} }; }
afterEach(()=>vi.unstubAllGlobals());
describe('evolução editorial',()=>{
  it('oferece oito percursos preenchidos, cobertura mínima e fontes rastreáveis',()=>{
    expect(themes).toHaveLength(8);
    expect(themes.filter(t=>t.quizEnabled)).toHaveLength(6);expect(themes.filter(t=>t.rankingEligible)).toHaveLength(6);
    expect(themes.flatMap(t=>t.postPool).length).toBeGreaterThanOrEqual(72);
    for(const t of themes){
      expect(t.postPool.length).toBeGreaterThanOrEqual(t.id==='clima-vegetacao'?12:['musica-audiovisual','festas-religiosidade'].includes(t.id)?10:8);
      for(const p of t.postPool){expect(p.sources.length,p.id).toBeGreaterThan(0);expect(p.sources.every(id=>sources.some(s=>s.id===id)),p.id).toBe(true);expect(p.imageCredit).not.toBe('');expect(p.imageLicense).not.toBe('');expect(p.editorialStatus).toBe('review-pending');}
    }
  });
  it('preserva recortes cartográficos distintos e quatro localidades oficiais',()=>{expect(states.features).toHaveLength(27);expect(states.features.filter(f=>f.properties.isNordeste)).toHaveLength(9);expect(semiarido.features).toHaveLength(1477);expect(caatinga.features).toHaveLength(1);expect(localities).toHaveLength(4);expect(localities.map(l=>l.locality)).toEqual(['Teresina','Salgueiro','Caruaru','Recife']);});
  it('registra apenas link audiovisual verificado e não baixa vídeo protegido',()=>{expect(video.url).toBe('https://www.youtube.com/watch?v=hj1fyV3pvSM');expect(video.channel).toBe('BAGUM SABOA animações');expect(video.year).toBe(2008);expect(video.director).toBe('Fernando Miller');expect(video.requiresNetwork).toBe(true);expect(video.externalPlaybackOnly).toBe(true);expect(video.licenseNote).toContain('Não baixar');});
  it('troca as representações factuais por fotos e identifica registros de contexto',()=>{for(const p of themes[0].postPool)expect(p.sourceMetadata.assetType).not.toMatch(/IA|sintétic/i);expect(themes[2].postPool.find(p=>p.id==='personalidades-11')?.image).toContain('anastacia');expect(existsSync('public/content/image-manifest.json')).toBe(true);});
  it('não atribui pontos nem perguntas aos percursos livres',()=>{
    const rounds=Object.fromEntries(themes.map(t=>[t.id,createRound(t,{posts:[],questions:[]})]));
    for(const t of themes.filter(t=>!t.quizEnabled))expect(rounds[t.id].questions).toEqual([]);
    rounds['musica-audiovisual'].rankingAnswers={'inventada':0};expect(summarizeVisit({},rounds)).toEqual({correct:0,answered:0,total:18,completedThemes:0});
  });
  it('migra visita v2 conservando respostas, visita e temas já pontuados',()=>{
    vi.stubGlobal('localStorage',storage());vi.stubGlobal('sessionStorage',storage());
    const session=createSession();const old={...session,version:2,rounds:Object.fromEntries(themes.filter(t=>t.quizEnabled).map(t=>{
      const r=session.rounds[t.id];const dependent=r.questions.flatMap(q=>q.postIds?.filter(id=>r.postIds.includes(id))??[]);
      const postIds=[...new Set([...dependent,...r.postIds])].slice(0,5);
      const rankingAnswers=Object.fromEntries(r.questions.map(q=>[q.id,q.optionOrder![q.correctIndex]]));
      return [t.id,{...r,postIds,seenPostIds:postIds,rankingAnswers,questions:r.questions.map(q=>({id:q.id,optionOrder:q.optionOrder}))}];
    }))};
    sessionStorage.setItem(SESSION_KEY,JSON.stringify(old));
    const migrated=loadSession();expect(migrated.visitId).toBe(session.visitId);expect(Object.keys(migrated.rounds)).toHaveLength(8);
    expect(summarizeVisit({},migrated.rounds)).toMatchObject({correct:18,answered:18,completedThemes:6});
    for(const t of themes)expect(migrated.rounds[t.id].postIds).toHaveLength(t.postsPerVisit);
    persistSession(migrated);expect(JSON.parse(sessionStorage.getItem(SESSION_KEY)!).version).toBe(3);
    expect(loadSession()).toEqual(migrated);
  });
  it('usa quatro áreas vetoriais licenciadas e um QR local para o endereço público',()=>{
    expect(subregions.regions.map(r=>r.id)).toEqual(['meio-norte','sertao','agreste','zona-mata']);expect(new Set(subregions.regions.map(r=>r.fill)).size).toBe(4);expect(subregions.stateBorders).toHaveLength(9);expect(subregions.source.license).toBe('CC BY 2.5');expect(subregions.source.creator).toBe('Raphael Lorenzeto de Abreu');expect(subregions.coordinateSystem).toContain('not georeferenced');expect(subregions.regions.every(r=>r.d.startsWith('M')&&r.d.length>100)).toBe(true);
    expect(site.publicUrl).toBe('https://flic2026-sertao-guxtavopereira.vercel.app/');expect(existsSync('public'+site.qrImage)).toBe(true);
  });

});
