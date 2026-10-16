# Ariano Suassuna e o Sertão — FLIC 2026

Museu touch com seis temas, **48 posts e 102 perguntas no pool**. A cada visita são selecionados cinco posts por tema e três perguntas ligadas aos posts efetivamente apresentados. As seis xilogravuras originais continuam nos cards da Home; os posts incluem 29 fotografias/registros locais com crédito e licença. Tema claro, fontes locais, PWA e ranking local opcional.

## Executar e validar

Node.js 22/24. `npm ci`, `npm run dev`.

- `npm run lint`: código e regras de hooks.
- `npm test`: conteúdo, contratos, seleção, embaralhamento, histórico, sessões e ranking.
- `npm run test:offline`: servidor local do pacote Windows.
- `npm run build`: tipos strict, Vite e precache em `dist/`.
- `npm run test:e2e`: percursos, toque, teclado, direitos, rede desligada, responsividade e acessibilidade.

Na Vercel, o build só publica se lint, testes, tipos, build e E2E passarem. O Chromium de testes roda no build remoto; nenhum navegador é instalado no computador do visitante.

## Como adicionar posts e perguntas

Edite `src/content/pools.json` (fonte de verdade). Os dados originais de `modules.json` foram preservados como referência editorial; não são o pool ativo.

Posts: `id`, `themeId`, `topicId`, `title`, `text`/`body`, `curiosity`, `assetId`, `tags`, `type`, `introductory`, `order`, `status`. A normalização resolve `assetId` em `image`, `alt` e `sourceMetadata` dos catálogos `topic-assets.json`/`documentary-assets.json`.

Perguntas: `id`, `themeId`, `topicId`, **`postIds`**, `question`, quatro `options` distintas, `correctIndex` (0–3), `feedback`, `difficulty` (1–3), `tags`. `postIds` restringe a pergunta ao post que realmente ensina a resposta, mesmo que dois posts tenham o mesmo assunto. A interface resolve a resposta canônica após embaralhar as alternativas. Se mudar alternativas ou resposta correta de uma pergunta existente, atribua um novo ID e revise a versão de conteúdo/sessão, evitando reinterpretar respostas de uma visita em andamento. O schema bloqueia IDs repetidos, referências órfãs, alternativas duplicadas e níveis inválidos.

Para acrescentar conteúdo: crie o post, associe a uma imagem local com fonte/licença, escreva perguntas que o texto responda e execute os testes. Introduções alternativas sobre o mesmo tópico podem ter `introductory: true`; somente uma será escolhida. `order` preserva a sequência pedagógica ou cronológica.

## Rotação e sessão

`domain/rotation.ts` seleciona uma introdução e complementos sem repetir assunto na mesma rodada. Prioriza conteúdos ainda não vistos, depois os menos recentes, com fallback finito quando todos já apareceram. O histórico é local, anônimo e limitado a 120 IDs de cada tipo.

A seleção fica fixa durante a visita, inclusive em retornos e recargas. `sessionStorage` guarda IDs, ordem das alternativas, posições e respostas com versão/validação. Sessões antigas incompatíveis recomeçam; ranking e preferências ficam preservados. Sem armazenamento, o museu continua em memória, com aviso se o ranking não puder ser salvo.

O quiz é liberado depois que os cinco posts foram exibidos. São três perguntas sem duplicação: uma de reconhecimento, uma de compreensão e uma de interpretação. Pool insuficiente ou desequilibrado não produz uma rodada competitiva menor. A ordem das perguntas e alternativas varia. Esses níveis são editoriais e ainda precisam de calibração com o público.

## Ranking e tentativas

A primeira rodada **concluída** de cada tema vale 100 pontos por acerto, até três acertos por tema. Uma rodada de treino sorteia novos posts/perguntas e não altera a pontuação inicial. Quizzes parciais não entram no ranking. Não há limite artificial de tempo para leitura.

O ranking separa categorias de 1 a 6 temas concluídos, comparando 3, 6, 9, 12, 15 ou 18 respostas. Mesmo número de acertos compartilha posição. Resultados antigos continuam em **Edição anterior**, sem misturar regras ou apagar dados. Participação opcional com primeiro nome/apelido (2–24 caracteres) e escolha explícita de exibição; um registro por visita e até mil registros recentes.

Não há identidade verificada, anti-fraude de servidor ou garantia contra pessoas que reiniciem visitas deliberadamente. Repetir apelidos não identifica a mesma pessoa de modo confiável. O ranking é uma atividade educativa local, não uma competição autenticada. Não foram adicionados Supabase nem serviços remotos; interfaces de repositório isolam a persistência para eventual trabalho futuro.

## Offline no display Windows

O pacote **FLIC2026-Offline-Windows.zip** inclui o build completo, fontes, imagens, iniciador, servidor e runtime oficial portátil Node.js 22.23.3 x64. No Windows 10/11 x64 do display: extrair o ZIP, abrir `INICIAR-MUSEU.cmd` e usar `http://127.0.0.1:4173/` no Edge/Chrome. Funciona desde a primeira abertura sem rede e sem acessar Vercel. Não instala dependências, exige login nem pede privilégios administrativos. O servidor só escuta no próprio computador. Ver `offline/LEIA-ME.txt`.

O runtime Windows é distribuído no ZIP de entrega, não no Git nem no bundle Vercel. SHA-256 conferido contra `https://nodejs.org/dist/v22.23.3/SHASUMS256.txt`. O Windows do display ainda precisa de ensaio presencial; o ambiente de preparação é Linux.

No site publicado, aguarde “Pronto para usar offline” antes de desligar a rede. As atualizações PWA só são oferecidas na Home. Todas as imagens e fontes ficam no precache. Links para fontes externas precisam de internet; os conteúdos não. O ranking local e o da Vercel são separados por endereço/perfil de navegador.

## Conteúdo, direitos e limites

[FONTES-IMAGENS.md](FONTES-IMAGENS.md) registra créditos/licenças e tipos documentais. Retratos, monumentos, documentos e locais são identificados; não se confundem com capas ou cenas. Não foram encontradas capas/encenações de O Santo e a Porca e Uma Mulher Vestida de Sol com reutilização confirmada; foram usados retratos contextuais reais do autor. Fontes primárias pedagógicas ficam nos posts.

Os cinco painéis literários preservam a regra de direitos: paráfrases educativas identificadas; trechos literais só com aprovação, revisão, edição, página, autorização e fonte. Nenhuma citação pendente foi liberada. Nordeste, sertão e semiárido não são tratados como sinônimos.

O repositório disponível não continha `AGENTS.md` nem `ARQUITETURA_VERCEL.md`; foram consideradas as regras originais já fornecidas e a arquitetura efetivamente implementada. Ver [CHECKLIST-IMPLEMENTACAO.md](CHECKLIST-IMPLEMENTACAO.md) para auditoria e pendências. Antes da feira, realizar revisão pedagógica, calibração das perguntas com alunos e ensaio no display definitivo. Testes automatizados não equivalem a validação presencial.
