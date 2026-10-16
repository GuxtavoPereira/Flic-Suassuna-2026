# O Sertão de Ariano Suassuna

**FLIC 2026** · exposição touch, tema claro, textos/fontes/imagens locais e ranking opcional neste navegador.

Versão pública: https://flic2026-sertao-guxtavopereira.vercel.app — oito percursos/90 posts, publicada por autorização expressa do proprietário em16/10/2026.

São **8 percursos, 90 posts e 102 perguntas** no pool. A visita apresenta 12 posts de Clima, 10 de Música, 11 de Festas e 8 em cada um dos outros temas. Seis temas-base têm três perguntas por rodada, exclusivamente dos posts apresentados. Música e Festas são percursos livres sem pontuação. O ranking conserva o máximo de 18 acertos e os registros anteriores.

A capa de Festas e Religiosidade mostra a capela da Fazenda Acauã, Aparecida/PB: fotografia real de Rogerio121402, 2015, CC BY-SA 4.0. As seis xilogravuras originais continuam nas seis capas-base. Posts factuais e painéis de obras usam fotografias ou registros identificados; obras sem reprodução autorizada usam contexto explicitamente descrito.

## Executar e validar

Node.js 22/24. Instalação: `npm ci`. Desenvolvimento: `npm run dev`.

| Comando | Verificação |
| --- | --- |
| `npm run lint` | ESLint e hooks |
| `npm run typecheck` | TypeScript strict |
| `npm run validate:content` | Imagens/fontes locais e manifesto por post |
| `npm test` | Conteúdo, seleção, migração, direitos e ranking |
| `npm run test:offline` | Servidor portátil: rotas, MIME, métodos e arquivos ausentes |
| `npm run build` | Tipos, Vite e precache PWA |
| `npm run test:e2e` | Navegação, teclado/toque, axe, offline, QR e atualização PWA |

A CI do PR executa verificações e E2E sem publicar. O build da Vercel verifica explicitamente `VERCEL_ENV=preview` ou `production`. O proprietário autorizou a publicação desta evolução no endereço público em 16/10/2026. Resultados reais e limitações estão em [AUDITORIA-EVOLUCAO.md](AUDITORIA-EVOLUCAO.md), [CHECKLIST-EVOLUCAO.md](CHECKLIST-EVOLUCAO.md) e [PENDENCIAS-CURADORIA.md](PENDENCIAS-CURADORIA.md).

## Onde editar

- `src/content/pools.json`: posts e questões ativos; IDs estáveis, fontes e associação por `topicId`/`postIds`.
- `experience-settings.json`: `quizEnabled`, `rankingEligible` e quantidade de posts por visita.
- `editorial-sources.json`: referências editoriais. `src/content/index.ts` também conserva referências anteriores e normaliza o conteúdo.
- `topic-assets.json`, `documentary-assets.json`, `evolution-assets.json`: imagens locais, legendas, créditos e licenças.
- `src/content/maps/`: bases oficiais e metadados de aquisição/data/metodologia.
- `videos.json`: URL externa, canal, título, data e limites da verificação de Calango Lengo.
- `modules.json`: pacote original de referência; suas contagens antigas não determinam o carrossel ativo.

Após editar, executar a validação de conteúdo, reconstruir `dist` antes de verificar o precache e executar testes. [MODELO-CONTEUDO.md](MODELO-CONTEUDO.md) detalha contratos e migração. [TELAS_E_UX.md](TELAS_E_UX.md) descreve as telas e rotas atuais.

## Offline na escola

O ZIP Windows contém o site completo e Node.js oficial portátil 22.23.3 x64. Extrair, abrir `INICIAR-MUSEU.cmd` e usar `http://127.0.0.1:4173/` no Edge/Chrome. Pode abrir pela primeira vez sem internet; não depende da Vercel. Não exige instalação/admin. O servidor só escuta no próprio computador. É possível extrair em F: no computador da escola.

Na versão web, esperar “Pronto para usar offline” antes de desconectar. O PWA oferece atualização apenas na Home e preserva a visita compatível. O ranking é separado por endereço e perfil: Vercel e localhost não compartilham nomes/resultados. Vídeos e fontes externas precisam de rede; mapas, textos e imagens não.

## Limites editoriais

As camadas de estados/Nordeste, Caatinga IBGE 2019 e semiárido IBGE 2022 são diferentes. Quatro painéis apresentam sub-regiões didáticas por localidades de referência; polígonos sub-regionais com metodologia validada continuam pendentes. Não tratar o recorte de 2022 como limite legal vigente em 2026.

Calango tem referência verificada por oEmbed e catálogos, mas reprodução integral/titularidade jurídica do canal não foram confirmadas. QR abre no celular; não há download de vídeo, letra, frame ou cartaz sem permissão. A ficha tipográfica não é cartaz oficial.

Textos são sínteses pedagógicas em revisão. Trechos literais de Ariano continuam ocultos até conferência de edição, página, direitos e aprovação. O ensaio com alunos e no display Windows iluminado, a cerca de 1,5 m, permanece necessário. Ver [FONTES-IMAGENS.md](FONTES-IMAGENS.md) e a tabela [IMAGENS-POR-POST.md](IMAGENS-POR-POST.md).
