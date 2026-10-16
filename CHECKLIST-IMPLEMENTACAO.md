# Checklist de Implementação — FLIC 2026

**Projeto:** Ariano Suassuna e o Sertão — FLIC 2026
**Objetivo:** Evoluir o museu digital com conteúdos dinâmicos, quizzes variados, imagens específicas e representações fiéis das obras de Ariano Suassuna.

## Fase 1 — Análise e preparação

- [ ] Ler `README.md`, `AGENTS.md` e `ARQUITETURA_VERCEL.md`.
- [x] Analisar a implementação atual do projeto.
- [x] Identificar componentes de cards, carrosséis, quizzes e ranking.
- [x] Examinar os dados educacionais existentes.
- [x] Identificar imagens repetidas, genéricas ou incompatíveis com os posts.
- [x] Preservar as funcionalidades já implementadas.
- [x] Criar uma estratégia de migração dos dados antigos.
- [x] Registrar as alterações necessárias antes da implementação.

**Critério de aceite:** arquitetura compreendida, sem perda de funcionalidades existentes.

## Fase 2 — Estrutura de dados dinâmica

- [x] Criar um pool de posts para cada um dos seis módulos.
- [x] Criar um pool de perguntas associado a cada módulo.
- [x] Relacionar posts e perguntas por `topicId`.
- [x] Definir identificadores únicos e estáveis para os conteúdos.
- [x] Permitir que diferentes posts abordem o mesmo assunto.
- [x] Adicionar níveis de dificuldade às perguntas.
- [x] Organizar conteúdos em arquivos estruturados TypeScript ou JSON.
- [x] Validar os dados para evitar perguntas sem respostas ou posts correspondentes.

### Estrutura mínima dos posts

- [x] `id`
- [x] `themeId`
- [x] `topicId`
- [x] `title`
- [x] `text`
- [x] `image`
- [x] `alt`
- [x] `tags`
- [x] `type`
- [x] `sourceMetadata`

### Estrutura mínima das perguntas

- [x] `id`
- [x] `themeId`
- [x] `topicId`
- [x] `question`
- [x] `options`
- [x] `correctAnswer`
- [x] `explanation`
- [x] `difficulty`
- [x] `tags`

**Critério de aceite:** conteúdos podem ser adicionados sem alterar a lógica do carrossel ou do quiz.

## Fase 3 — Rotação inteligente dos posts

- [x] Criar seleção aleatória de posts por sessão.
- [x] Manter posts introdutórios obrigatórios, quando necessário.
- [x] Variar posts complementares entre visitas.
- [x] Evitar conteúdos duplicados em uma mesma sessão.
- [x] Preservar a sequência pedagógica dos assuntos.
- [x] Criar identificador de sessão.
- [x] Registrar os posts exibidos durante a visita.
- [x] Implementar histórico de conteúdos recentes.
- [x] Reduzir repetição de posts nas visitas seguintes.
- [x] Criar fallback quando não houver posts inéditos suficientes.
- [x] Permitir reiniciar a exposição.

**Critério de aceite:** visitas consecutivas apresentam variações sem prejudicar a compreensão dos temas.

## Fase 4 — Pool de perguntas e quiz dinâmico

- [x] Criar múltiplas perguntas para cada tema.
- [x] Selecionar perguntas aleatoriamente.
- [x] Sortear perguntas somente sobre conteúdos apresentados naquela sessão.
- [x] Variar a ordem das perguntas.
- [x] Embaralhar as alternativas sem alterar a resposta correta.
- [x] Evitar perguntas repetidas dentro da mesma tentativa.
- [x] Registrar perguntas utilizadas recentemente.
- [x] Reduzir repetição nas tentativas seguintes.
- [x] Manter quantidade fixa de perguntas por quiz competitivo.
- [x] Equilibrar os níveis de dificuldade.
- [x] Exibir feedback pedagógico após cada resposta.
- [x] Exibir resultado e pontuação ao final.
- [x] Permitir iniciar uma nova rodada com conteúdos diferentes.
- [x] Tratar situações em que o pool de perguntas seja insuficiente.

### Exemplo de associação

- [x] Pergunta sobre umbuzeiro → post sobre umbuzeiro exibido anteriormente.
- [x] Pergunta sobre cuscuz → post sobre cuscuz exibido anteriormente.
- [x] Pergunta sobre Caatinga → post explicativo sobre Caatinga.
- [x] Pergunta sobre cordel → post explicativo sobre cordel.
- [x] Pergunta sobre uma obra literária → conteúdo correspondente apresentado antes do quiz.

**Critério de aceite:** nenhuma pergunta exige conhecimento que não tenha sido apresentado durante a visita, salvo se explicitamente identificada como desafio extra sem impacto no ranking.

## Fase 5 — Sistema de pontuação e ranking

- [x] Manter pontuação padronizada para respostas corretas.
- [x] Garantir o mesmo número de perguntas por rodada competitiva.
- [x] Evitar vantagens decorrentes de quizzes com quantidades diferentes de perguntas.
- [x] Equilibrar a dificuldade entre as rodadas.
- [x] Definir critérios de desempate.
- [x] Evitar repetição imediata de perguntas.
- [x] Definir se o ranking será geral ou separado por módulo.
- [x] Permitir cadastro de apelido sem exigir dados pessoais.
- [x] Definir limite de caracteres e validação dos apelidos.
- [x] Evitar exposição de informações pessoais de crianças.
- [x] Definir regras para múltiplas tentativas.
- [ ] Considerar somente a melhor pontuação por participante identificado, quando houver identificação confiável.
- [ ] Preparar estrutura compatível com Supabase.
- [ ] Validar pontuações no servidor quando houver ranking online.
- [ ] Não confiar exclusivamente em pontuações enviadas pelo navegador.
- [ ] Diferenciar resultados locais pendentes de resultados confirmados no ranking online.

**Critério de aceite:** o ranking compara rodadas equivalentes e não aceita pontuações arbitrárias enviadas pelo cliente.

## Fase 6 — Imagens específicas para cada post

- [x] Auditar todas as imagens existentes.
- [x] Identificar posts que utilizam imagens genéricas.
- [x] Definir uma imagem principal específica para cada post.
- [x] Criar ou selecionar imagens de plantas e animais citados.
- [x] Criar ou selecionar imagens específicas dos alimentos apresentados.
- [x] Utilizar referências geográficas e culturais apropriadas.
- [x] Manter coerência com a identidade visual em xilogravura.
- [x] Evitar representações visualmente incorretas de espécies, pratos e objetos.
- [x] Não utilizar retratos gerados por IA como se fossem fotografias documentais.
- [x] Otimizar imagens em WebP ou AVIF quando apropriado.
- [x] Incluir textos alternativos descritivos.
- [x] Evitar inserir textos importantes diretamente nas imagens.
- [x] Garantir que todas as imagens necessárias estejam disponíveis offline.

### Imagens prioritárias

- [x] Umbuzeiro e fruto do umbu.
- [x] Mandacaru.
- [x] Xique-xique.
- [x] Caatinga em período seco.
- [x] Caatinga após as chuvas.
- [x] Literatura de cordel.
- [x] Xilogravura.
- [x] Instrumentos musicais nordestinos.
- [x] Cuscuz nordestino.
- [x] Baião de dois.
- [x] Carne de sol.
- [x] Rapadura.
- [x] Personalidades históricas apresentadas.
- [x] Obras e elementos relacionados a Ariano Suassuna.

**Critério de aceite:** todos os posts possuem imagens apropriadas ao assunto, sem substituições genéricas ou referências enganosas.

## Fase 7 — Obras de Ariano Suassuna

- [x] Revisar o módulo Vida e Obras de Ariano Suassuna.
- [x] Apresentar biografia e trajetória com dados verificados.
- [x] Criar uma seção individual para cada obra principal.
- [x] Utilizar fotografias reais e registros documentais quando disponíveis e adequadamente licenciados. **Santo e Sol: retratos contextuais do autor; capas/cenas licenciadas ainda pendentes.**
- [x] Diferenciar fotografias históricas, adaptações e ilustrações contemporâneas.
- [x] Registrar créditos e fontes verificáveis.
- [x] Não atribuir ao autor frases que não tenham sido verificadas.
- [ ] Conferir trechos literários nas respectivas edições.
- [x] Contextualizar os trechos para estudantes de 11 a 15 anos.
- [x] Relacionar as obras aos temas do sertão sempre que houver fundamento.
- [x] Explicar o Movimento Armorial e seu contexto histórico.
- [x] Evitar confundir personagens das adaptações audiovisuais com os das obras literárias originais.

### Obras prioritárias

- [x] *Auto da Compadecida*.
- [x] *O Santo e a Porca*.
- [x] *Romance d'A Pedra do Reino*.
- [x] *Uma Mulher Vestida de Sol*.
- [x] Movimento Armorial.

### Metadados das imagens

- [x] `sourceName`
- [x] `sourceUrl`
- [x] `credit`
- [x] `caption`
- [x] `licenseNote`
- [x] `assetType`
- [x] `relatedWork`

**Critério de aceite:** as representações das obras são fiéis, devidamente identificadas e acompanhadas de fontes rastreáveis.

## Fase 8 — Interface e navegação

- [x] Preservar a identidade visual com fundo branco ou creme-claro.
- [x] Manter xilogravuras com cores pontuais.
- [x] Garantir contraste suficiente para ambientes iluminados.
- [x] Manter os seis cards principais na Home.
- [x] Implementar carrosséis reutilizáveis.
- [x] Garantir botões de toque grandes.
- [x] Permitir avançar e voltar pelos posts.
- [x] Manter indicadores de progresso.
- [x] Permitir retornar à Home a qualquer momento.
- [x] Mostrar claramente o início do quiz.
- [x] Apresentar feedback visual para respostas.
- [x] Implementar estados de carregamento e erro.
- [x] Respeitar preferências de movimento reduzido.
- [x] Evitar excesso de animações e elementos decorativos.

**Critério de aceite:** a aplicação permanece simples, legível e adequada à navegação em um totem touch screen.

## Fase 9 — Funcionamento offline e Vercel

- [x] Preservar a hospedagem em um único projeto Vercel.
- [x] Manter a configuração PWA.
- [x] Implementar cache dos arquivos necessários à visita.
- [x] Incluir imagens dos posts no planejamento de cache.
- [x] Garantir que os quizzes funcionem sem internet.
- [x] Armazenar temporariamente o histórico local.
- [x] Definir estratégia de atualização dos conteúdos.
- [x] Tratar falta de conexão com serviços externos.
- [ ] Exibir um aviso discreto quando o ranking online estiver indisponível. **Não se aplica: ranking exclusivamente local.**
- [x] Evitar perda de sessão durante instabilidades da rede.
- [x] Testar a aplicação após desligar a conexão de internet.
- [x] Evitar que uma atualização do PWA interrompa uma visita em andamento.

**Critério de aceite:** após instalação e carregamento dos recursos, a visitação continua funcionando sem internet, exceto pelos serviços explicitamente online.

## Fase 10 — Testes automatizados

- [x] Criar testes para seleção aleatória de posts.
- [x] Criar testes para seleção aleatória de perguntas.
- [x] Testar associação entre perguntas e posts.
- [x] Testar embaralhamento de alternativas.
- [x] Garantir que a resposta correta permaneça válida.
- [x] Testar histórico de perguntas recentes.
- [x] Testar o fallback de pools insuficientes.
- [x] Testar pontuação e critérios de desempate.
- [x] Testar navegação por toque.
- [x] Testar carrosséis em diferentes resoluções.
- [x] Testar imagens ausentes e erros de carregamento.
- [x] Testar o funcionamento offline.
- [x] Executar testes de ponta a ponta. **20 testes aprovados no build remoto.**
- [x] Executar verificação de tipos.
- [x] Executar lint.
- [x] Executar build de produção.

**Critério de aceite:** testes críticos aprovados e aplicação compilada sem erros.

## Fase 11 — Revisão editorial e validação

- [x] Revisar ortografia e clareza de todos os posts.
- [x] Validar conteúdos geográficos e históricos.
- [x] Verificar informações sobre flora e fauna.
- [x] Verificar receitas, ingredientes e tradições culinárias.
- [x] Conferir autoria e contexto das citações literárias.
- [x] Verificar todas as referências visuais.
- [x] Revisar as perguntas e respostas dos quizzes.
- [x] Confirmar que a linguagem é adequada ao Ensino Fundamental II.
- [ ] Testar a experiência com usuários representativos do público-alvo.
- [ ] Corrigir problemas identificados na validação.

**Critério de aceite:** conteúdos consistentes, acessíveis e pedagogicamente apropriados.

## Fase 12 — Entrega

- [x] Consolidar as alterações no projeto.
- [x] Documentar a nova estrutura de conteúdo.
- [x] Registrar onde adicionar posts e perguntas.
- [x] Documentar a lógica de rotação.
- [x] Documentar a integração entre posts e quizzes.
- [x] Atualizar o README.
- [x] Registrar fontes e créditos das imagens.
- [x] Documentar limitações conhecidas.
- [x] Executar a validação final. **Lint, tipos, build, 46 testes unitários, servidor local e 20 E2E aprovados.**
- [x] Preparar o projeto para publicação na Vercel.

### Definição de pronto

Uma funcionalidade só deverá ser considerada concluída quando:

- [x] Estiver implementada no código.
- [x] Estiver integrada à navegação existente.
- [x] Possuir os dados necessários.
- [x] Estiver validada por testes apropriados.
- [x] Não comprometer o funcionamento offline.
- [x] Não causar regressões em outras funcionalidades.
- [x] Estiver documentada.

---

## Instruções finais para o Codex

1. Leia a documentação existente antes de editar o código.
2. Analise a arquitetura real do repositório.
3. Execute as fases na ordem indicada.
4. Reutilize componentes e serviços existentes sempre que possível.
5. Não substitua implementações funcionais sem necessidade.
6. Não invente fontes, citações, imagens documentais ou informações históricas.
7. Não marque tarefas como concluídas antes de validar sua implementação.
8. Execute os testes relevantes após cada fase.
9. Atualize este checklist conforme o progresso.
10. Ao concluir, apresente um resumo das alterações, testes realizados, pendências e próximos passos.

## Auditoria desta atualização — 15/10/2026

**Já existente, preservado:** seis cards e xilogravuras, carrosséis touch, leitura literária com bloqueio de trechos pendentes, quizzes e feedback, ranking local opt-in, estados seguros, PWA, tela clara, linha do tempo, ciclo da Caatinga e testes. Esses itens não foram reconstruídos.

**Implementado agora:** 48 posts/102 perguntas; `topicId` e `postIds`; imagens específicas locais; sorteios com histórico; sessão estável e retomada; 3 perguntas equilibradas por tema; alternativas embaralhadas; primeiro resultado competitivo congelado; treino com novos conteúdos; ranking por quantidade de temas, edição antiga separada sem apagar dados; metadados e 29 fotos; iniciador/pacote offline para Windows x64 do display.

**Documentação de entrada ausente:** `AGENTS.md` e `ARQUITETURA_VERCEL.md` não estão no repositório disponível. O README e a arquitetura real foram lidos; as regras originais conhecidas de offline, touch, direitos e tema claro foram preservadas.

**Itens condicionais fora do escopo:** Supabase, ranking online, validação de servidor e resultados pendentes/confirmados não se aplicam ao ranking local escolhido. A persistência já usa uma interface de repositório. Não existe identificação confiável de participantes, portanto não se juntam pessoas só pelo apelido. Não há alegação de antifraude contra manipulação do navegador.

**Direitos pendentes:** transcrições literais não conferidas permanecem ocultas. Não foram liberadas citações. Santo e Sol não receberam capas/cenas sem licença; retratos reais contextuais são rotulados. Alguns registros de personalidades são homenagens/esculturas, identificados como tal.

**Validação:** lint, tipos, 46 testes unitários e teste do servidor local aprovados na preparação; build de produção gerado. Os 20 E2E passaram no build remoto publicado (commit `e747bec`), incluindo treino sem alterar a pontuação, imagens offline e primeira abertura local sem requisições externas. Ensaios com alunos e no Windows/display definitivo permanecem pendentes e não são substituídos por testes automatizados. Os níveis de dificuldade são editoriais, sem calibração empírica ainda.

**Pacote offline:** Windows 10/11 x64; execução local desde a primeira abertura sem internet, com runtime oficial portátil incluído. O executável Windows não foi executado no ambiente Linux de preparação. O guia de operação acompanha o pacote.

**Prioridade principal:** tornar as visitas variadas, educativas e visualmente fiéis ao tema, preservando a estabilidade da aplicação para uso na FLIC 2026.

## Atualização visual — lotes 1 e 2 (16/10/2026)

- [x] Conferir manifestos e inspecionar as artes.
- [x] Associar as 14 imagens aos posts pelos IDs fornecidos.
- [x] Identificar geração por IA e manter registros documentais com créditos próprios.
- [x] Preservar perguntas, conteúdo, sessões e ranking.
- [x] Incluir artes e manifestos locais no cache offline.
- [x] Lint, tipos, build e 47 testes unitários aprovados localmente.
- [ ] Concluir a bateria E2E remota e atualizar o pacote Windows desta edição.
- [ ] Receber e conferir o lote 3.
- [ ] Confirmar destino da alternativa de ariano-04 antes de usá-la em outra obra.
