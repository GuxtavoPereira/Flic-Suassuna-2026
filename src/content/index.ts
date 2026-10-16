import experienceSettings from './experience-settings.json';
import raw from './modules.json';
import editorialSources from './editorial-sources.json';
import excerptData from './excerpts.json';
import poolData from './pools.json';
import evolutionAssets from './evolution-assets.json';
import topicAssets from './topic-assets.json';
import documentaryAssets from './documentary-assets.json';
import suppliedAssets from './supplied-assets.json';
export { default as suppliedAssets } from './supplied-assets.json';
import { poolSchema } from './pool-schema';
import { contentSchema, type LiterarySlide, type Theme, type RawModuleId } from '../domain/content';
export const sources = [
  ...editorialSources,
  { id: 'caatinga', label: 'ICMBio · Caatinga', url: 'https://www.gov.br/icmbio/pt-br/assuntos/unidade-de-conservacao/unidades-de-biomas/caatinga' },
  { id: 'embrapa', label: 'Embrapa · Cactáceas da Caatinga', url: 'https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1153737/1/Mandacaru-Da-Racao-a-Medicina-2023.pdf' },
  { id: 'embrapa-umbu', label: 'Embrapa · Umbuzeiro', url: 'https://www.infoteca.cnptia.embrapa.br/handle/doc/85742' },
  { id: 'embrapa-rapadura', label: 'Fundação Joaquim Nabuco · Culinária e rapadura', url: 'https://pesquisaescolar.fundaj.gov.br/pt-br/artigo/culinaria-nordestina-no-brasil/' },
  { id: 'cordel', label: 'Iphan · Literatura de cordel', url: 'https://bcr.iphan.gov.br/bens-culturais/literatura-de-cordel/' },
  { id: 'forro', label: 'Iphan · Matrizes tradicionais do forró', url: 'https://www.gov.br/iphan/pt-br/assuntos/forro-do-mundo/sobre-o-forro' },
  { id: 'rachel-bio', label: 'Academia Brasileira de Letras · Rachel de Queiroz', url: 'https://www.academia.org.br/academicos/rachel-de-queiroz/biografia' },
  { id: 'gonzaga-bio', label: 'Fundação Joaquim Nabuco · Luiz Gonzaga', url: 'https://pesquisaescolar.fundaj.gov.br/pt-br/artigo/luiz-gonzaga/' },
  { id: 'vitalino-bio', label: 'Fundação Joaquim Nabuco · Vitalino Pereira', url: 'https://pesquisaescolar.fundaj.gov.br/pt-br/artigo/vitalino/' },
  { id: 'patativa-bio', label: 'Secretaria da Cultura do Ceará · Patativa do Assaré', url: 'https://www.ce.gov.br/secult/2025/03/05/116-anos-de-patativa-do-assare-o-eterno-canto-do-sertao/' },
  { id: 'fundaj-comida', label: 'Fundação Joaquim Nabuco · Culinária nordestina', url: 'https://pesquisaescolar.fundaj.gov.br/pt-br/artigo/culinaria-nordestina-no-brasil/' },
  { id: 'canudos', label: 'Fundação Joaquim Nabuco · Canudos', url: 'https://pesquisaescolar.fundaj.gov.br/pt-br/artigo/guerra-de-canudos/' },
  { id: 'abl-bio', label: 'Academia Brasileira de Letras · Biografia', url: 'https://www.academia.org.br/academicos/ariano-suassuna/biografia' },
  { id: 'abl-obras', label: 'Academia Brasileira de Letras · Bibliografia', url: 'https://www.academia.org.br/academicos/ariano-suassuna/bibliografia' },
  { id: 'fundaj', label: 'Fundação Joaquim Nabuco · Movimento Armorial', url: 'https://pesquisaescolar.fundaj.gov.br/pt-br/artigo/movimento-armorial/' },
  { id: 'usp', label: 'Universidade de São Paulo · Referência de curadoria', url: 'https://fflch.usp.br/63266' },
];
const metadata: Partial<Record<RawModuleId, { category: string; color: string; tint: string; alt: string; sources: string[] }>> = {
  clima: { category: 'NATUREZA', color: '#3F6037', tint: '#EDF0E3', alt: 'Ilustração em estilo xilogravura de cactos e vegetação da Caatinga.', sources: [] },
  cultura: { category: 'TRADIÇÕES', color: '#A34427', tint: '#F6E8DF', alt: 'Ilustração em estilo xilogravura com referências à cultura popular nordestina.', sources: ['fundaj'] },
  personalidades: { category: 'PESSOAS', color: '#88601E', tint: '#F7EEDB', alt: 'Galeria ilustrada de figuras culturais em estilo xilogravura, sem caráter fotográfico.', sources: [] },
  'linha-do-tempo': { category: 'HISTÓRIA', color: '#365E73', tint: '#E7EDF0', alt: 'Composição em estilo xilogravura sobre história e passagem do tempo.', sources: ['abl-bio', 'abl-obras', 'fundaj'] },
  culinaria: { category: 'SABORES', color: '#8E492F', tint: '#F5E7DA', alt: 'Mesa com alimentos nordestinos em ilustração no estilo da xilogravura.', sources: [] },
  ariano: { category: 'LITERATURA', color: '#66517B', tint: '#EDE8F1', alt: 'Composição ilustrada com máscaras de teatro, livro aberto, aves, cactos e sol.', sources: ['abl-bio', 'abl-obras', 'fundaj'] },
};
metadata['musica-audiovisual'] = { category: 'MÚSICA E TELAS', color: '#365E73', tint: '#E7EDF0', alt: 'Sanfona fotografada: um dos instrumentos das matrizes do forró.', sources: ['forro'] };
metadata['festas-religiosidade'] = { category: 'CELEBRAÇÕES', color: '#88601E', tint: '#F7EEDB', alt: 'Festa junina fotografada, uma entre muitas celebrações regionais.', sources: ['forro'] };
const parsed = contentSchema.parse(raw);
const modules = [...parsed.modules,
  { id: 'musica-audiovisual' as const, title: 'Música e Audiovisual Nordestino', subtitle: 'Sons, artistas e histórias nas telas.', cover: '/images/topics/sanfona.webp', slides: [], quiz: [] },
  { id: 'festas-religiosidade' as const, title: 'Festas e Religiosidade', subtitle: 'Celebrações, encontros e diversidade.', cover: '/images/topics/festa-junina.webp', slides: [], quiz: [] },
];
export const imageAssets = [...topicAssets, ...documentaryAssets, ...evolutionAssets, ...suppliedAssets];
const pool = poolSchema.parse(poolData);
const sourceIds: Record<string, string[]> = { clima: ['caatinga', 'embrapa'], cultura: ['cordel', 'forro', 'fundaj'], personalidades: ['gonzaga-bio', 'vitalino-bio', 'patativa-bio', 'abl-bio', 'rachel-bio', 'canudos'], 'linha-do-tempo': ['abl-bio', 'abl-obras', 'fundaj', 'canudos'], culinaria: ['fundaj-comida', 'embrapa-umbu', 'embrapa-rapadura'], ariano: ['abl-bio', 'abl-obras', 'fundaj'] };
export const themes: Theme[] = modules.map(m => {
  const id = m.id === 'clima' ? 'clima-vegetacao' : m.id;
  const postPool = pool.posts.filter(p => p.themeId === id).map(p => {
    const asset = imageAssets.find(a => a.id === p.assetId);
    if (!asset) throw new Error(`Imagem sem metadados: ${p.id} (${p.assetId})`);
    return { ...p, image: asset.image, alt: asset.alt, sourceMetadata: { ...asset, caption: [p.imageContext, asset.caption].filter(Boolean).join(' ') }, imageCredit: asset.credit, imageLicense: asset.licenseNote, sources: p.source };
  });
  const questionPool = pool.questions.filter(q => q.themeId === id).map(q => ({ ...q, sources: sourceIds[m.id] }));
  return { ...m, ...metadata[m.id]!, ...experienceSettings.find(t => t.id === id)!, rawId: m.id, id, slides: postPool.filter(p => m.slides.some(s => s.id === p.id)), quiz: m.quiz.map((q, i) => ({ ...q, themeId: id, topicId: postPool[Math.min(i + 1, 4)].topicId, difficulty: i + 1, tags: ['legado'], sources: sourceIds[m.id] })), postPool, questionPool };
});
const aliases: Record<string, string> = { clima: 'clima-vegetacao', 'cultura-sertao': 'cultura', 'figuras-influentes': 'personalidades', 'culinaria-nordestina': 'culinaria', 'ariano-vida-obras': 'ariano' };
export function findTheme(id: string | undefined) { return themes.find(t => t.id === (aliases[id ?? ''] ?? id)); }
const firstExcerpt = excerptData.excerpts[0];
export const literature: LiterarySlide[] = [
  { type: 'literary', id: 'auto', workTitle: 'Auto da Compadecida', year: 1955, genre: 'Teatro', author: 'Ariano Suassuna', context: firstExcerpt.context, placeholderParaphrase: firstExcerpt.pedagogicalCommentary, question: firstExcerpt.question, connectionToTheme: 'Oralidade, humor e histórias inventivas no teatro popular.', permissionStatus: 'pending', sources: ['abl-obras', 'usp'], moduleIds: ['cultura', 'ariano'] },
  { type: 'literary', id: 'santo', workTitle: 'O Santo e a Porca', year: 1957, genre: 'Teatro', author: 'Ariano Suassuna', context: 'Dinheiro e avareza.', placeholderParaphrase: 'A comédia questiona o apego excessivo aos bens materiais.', connectionToTheme: 'Uma proposta de conversa sobre escolhas e prioridades; não estabelece relação direta da obra com alimentos.', question: 'Como o humor pode nos fazer pensar sobre nossas prioridades?', permissionStatus: 'pending', sources: ['abl-obras'], moduleIds: ['culinaria', 'ariano'] },
  { type: 'literary', id: 'pedra', workTitle: "Romance d’A Pedra do Reino", year: 1971, genre: 'Romance', author: 'Ariano Suassuna', context: 'Imaginação, narrador e sertão.', placeholderParaphrase: 'O narrador constrói um universo literário atravessado por tradições, símbolos e referências populares.', connectionToTheme: 'Uma leitura sobre tradições narrativas e imaginação sertaneja. A publicação é um marco literário de 1971.', question: 'Como a imaginação transforma um lugar em um universo de histórias?', permissionStatus: 'pending', sources: ['abl-obras'], moduleIds: ['linha-do-tempo', 'ariano', 'cultura'] },
  { type: 'literary', id: 'sol', workTitle: 'Uma Mulher Vestida de Sol', year: 1947, genre: 'Teatro', author: 'Ariano Suassuna', context: 'Conflitos e drama.', placeholderParaphrase: 'A peça permite abordar conflitos, relações de poder e tradições dramáticas.', connectionToTheme: 'Uma estação de leitura sobre a trajetória teatral de Ariano.', question: 'O que os conflitos de uma peça podem revelar sobre relações de poder?', permissionStatus: 'pending', sources: ['abl-obras'], moduleIds: ['ariano'] },
  { type: 'literary', id: 'armorial', workTitle: 'Movimento Armorial', year: 1970, genre: 'Movimento artístico', author: 'Contexto da atuação de Ariano Suassuna', context: 'Arte popular e erudita. Este painel aborda um movimento, não uma obra específica.', placeholderParaphrase: 'Painel de síntese autoral sobre a proposta do movimento, sem atribuir frase inventada a Ariano.', connectionToTheme: 'Cordel, música, literatura e artes visuais dialogam na proposta armorial.', question: 'Que encontros você percebe entre a arte popular e outras formas de arte?', permissionStatus: 'pending', sources: ['fundaj'], moduleIds: ['cultura', 'ariano'] },
];
export const timeline = [
  { year: '1896–1897', title: 'Guerra de Canudos', description: themes[3].slides[1].body, relation: 'Contexto histórico regional · sem influência direta presumida', sources: ['canudos'] as string[] },
  { year: '1927', title: 'Nasce Ariano Suassuna', description: themes[3].slides[2].body, relation: 'Trajetória biográfica', sources: ['abl-bio'] },
  { year: '1955', title: 'Auto da Compadecida', description: themes[3].slides[3].body, relation: 'Escrita da obra · primeira encenação em 1956', sources: ['abl-obras'] },
  { year: '1970', title: 'Movimento Armorial', description: themes[1].slides[4].body, relation: 'Lançamento do movimento em Recife', sources: ['fundaj'] },
  { year: '1971', title: 'A Pedra do Reino', description: themes[5].slides[3].body, relation: 'Publicação do romance', sources: ['abl-obras'] },
  { year: '2014', title: 'Um legado que continua', description: 'Ariano Suassuna faleceu em 2014. Sua obra e sua valorização das culturas populares permanecem como temas de estudo.', relation: 'Trajetória biográfica', sources: ['abl-bio'] },
];
export const climateStages = [
  { name: 'Seca', description: 'Uma parte da vegetação perde folhas para reduzir a perda de água.', color: '#C99043' },
  { name: 'Nuvens', description: 'As chuvas são irregulares. A presença de nuvens anuncia uma possibilidade de mudança.', color: '#819AA0' },
  { name: 'Chuva', description: 'Depois das chuvas, muitas plantas brotam e florescem. A resposta varia de lugar para lugar.', color: '#487B99' },
  { name: 'Renascimento', description: 'A vegetação pode ficar mais verde. A aparência seca não significa que as plantas estivessem mortas.', color: '#53754A' },
];