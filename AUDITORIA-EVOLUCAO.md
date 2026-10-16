# Auditoria e execução por fases — 16/10/2026

## Fase 0 — diagnóstico validado
Base: main `8fcadf1abdd765d9afb39a02cdb32dca79edacc7`. Issue: https://github.com/GuxtavoPereira/Flic-Suassuna-2026/issues/1.

Lidos README, IMPLEMENTACAO, CHECKLIST-IMPLEMENTACAO, FONTES-IMAGENS, LOTES-IMAGENS; auditados App, estilos, conteúdo, rotação, sessão, quiz, ranking e PWA. Não disponíveis na entrada: AGENTS, ARQUITETURA_VERCEL, TELAS_E_UX, CONTEUDO_MODULOS, LITERATURA_E_DIREITOS. O JSON real é src/content/modules.json, com pool ativo pools.json.

Código real: seis módulos, 48 posts no pool, apenas cinco selecionados por tema; 102 perguntas, três por rodada, seis temas competitivos (máximo 18). Contagens fixas em App, rotation e visit-session. Ranking em localStorage, sessões v2 em sessionStorage. Atualização PWA oferecida apenas na Home. Nenhum backend obrigatório.

Imagens: 23 fotografias temáticas, seis registros documentais e 14 ilustrações fornecidas com procedência identificada; as ilustrações prevaleciam por postId, inclusive no clima. Seis capas originais preservadas. Prioridade factual passará para fotos; arquivos originais não serão apagados. Imagens sem permissão comprovada não entrarão como fotografias aprovadas.

Baseline antes de editar: npm run lint PASSOU; npm test 47/47; npm run test:offline 1/1; npm run build PASSOU (inclui tsc -b e PWA 75 entradas). Avisos preexistentes: configuração npm http-proxy e comentários PURE do Zod, sem falhas. E2E ainda não executado nesta auditoria; execução remota prevista. Conferência visual no equipamento físico pendente.

## Migração
Conservar IDs originais, aliases e URLs; adicionar musica-audiovisual e festas-religiosidade. Separar seis módulos competitivos dos oito percursos. Pontuação máxima continua 18; não alterar chave/formato de ranking v1 nem critérios v2. Conteúdo/sessão v3: expansão das rodadas com IDs válidos, preservando visitId, respostas canônicas, ordem de alternativas, histórico e rankingAnswers de sessão v2 compatível; novos posts precisam ser lidos antes de novo quiz. Não reinterpretar respostas de perguntas alteradas. Migração incompatível reinicia apenas visita, nunca ranking ou preferências.

## Registro por fase
Fase 0: este diagnóstico; checklist de origem preservado em CHECKLIST-EVOLUCAO.md; issue criada. Validação de código aprovada; revisão visual integral continua pendente e não será declarada por inferência.

### Fase 1 — estrutura implementada, aceite visual pendente
Arquivos: src/App.tsx, src/styles/main.css, src/domain/content.ts, src/domain/rotation.ts, src/services/visit-session.ts, src/content/index.ts, index.html, vite.config.ts. Título/metadados atualizados, oito cards e rotas, contagens variáveis e migração v2→v3 implementados. TypeScript/build passaram. Conteúdo dos novos percursos será incorporado na fase 2 antes de exposição externa; não marcar fase concluída enquanto os novos percursos não estiverem preenchidos/testados e sem conferência visual. Ranking original preservado.

### Fase 2 — conteúdo estruturado e navegável
Arquivos: src/content/pools.json, editorial-sources.json, pool-schema.ts, index.ts; domain/content.ts, rotation.ts e testes. Pool ampliado a 90 posts (16/10/11/10/10/10/11/12), fontes individuais, elegibilidade editorial, posts obrigatórios e complementos rotativos com fallback. Mostra 12 no clima, 10 em Música, 11 em Festas e 8 nos demais. Lint, 49 testes e servidor offline aprovados; tipos/build aprovados. Fotografias novas ainda em pesquisa para a fase 7: os novos conteúdos ainda não estão liberados editorialmente. Testes adicionais de cobertura e migração incluídos; aceite visual e curadoria pendentes. Nenhuma caixa global marcada como pronta.
