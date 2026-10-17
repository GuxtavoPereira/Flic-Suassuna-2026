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

### Fase 3 — mapas implementados com limite explícito
Arquivos: components/MapExplorer.tsx, content/maps/*.json, App, estilos, vite.config e evolution.test. Estados oficiais (27, sendo nove Nordeste), Caatinga IBGE 2019 e 1.477 municípios do recorte semiárido IBGE 2022 em camadas distintas; quatro painéis didáticos com pontos de centroides oficiais, lista equivalente e teclado. Lint, 53 testes, tipos/build passaram. PENDENTE: polígonos georreferenciados das quatro sub-regiões com metodologia validada; não foram inventados. PENDENTE: revisão cartográfica/pedagógica e inspeção visual no display. Caatinga: fonte/copyright oficial identificado, licença temática específica não presumida como licença da MMD. Não declarar a fase integralmente concluída.

### Fase 4 — economia e convivência implementadas
Arquivos: EconomyContext.tsx, App, estilos, pools.json, evolution-assets.json e public/images/evolution (27 fotos licenciadas catalogadas para esta e as próximas fases). Agricultura, pecuária, cisternas, infraestrutura e economia já fazem parte dos posts obrigatórios de clima; diagrama autoral sem escala, fotos adicionais de ovinos/bovinos/feijão/açude e referências cruzadas funcionam sem rede. Fontes MDS/Embrapa/Codevasf/Fundaj. Lint e build/tipos aprovados; 53/53 testes após reconstruir dist. Houve uma falha de teste contra dist anterior à entrada das fotos: reconstrução corrigiu o artefato e a verificação de precache passou. PENDENTE: foto de serviços contemporâneos e trabalho agrícola com regime familiar comprovado; roças não são rotuladas como propriedades familiares sem evidência. Ensaio visual no display pendente.

### Fase 5 — festas e religiosidade contextualizadas
Arquivos: pools.json (12 posts, 11 por visita), App (exemplos distintos na diversidade), imagens catalogadas na fase 4. Padre Cícero e controvérsias, Juazeiro/Dores/Candeias, devoção nacional a Aparecida, São João/São Pedro, quadrilha, reisado e fé/chuva com fontes Iphan, CNBB, Santuário, MinC e Funceme. Fotos identificam Aparecida em São Paulo e igreja de São Pedro no Recife, sem fingir romaria/celebração específica. PENDENTE: fotografia maior da festa de São Pedro em Itiruçu e registro autorizado de prática indígena; não representa todas as tradições por uma única foto. Quiz desativado no percurso livre; configuração por dados será consolidada na fase 9.

### Fase 6 — música e audiovisual implementados
Arquivos: VideoReference.tsx, videos.json, editorial-sources.json, evolution-assets.json, pools.json, App, estilos e evolution.test; fotos licenciadas de Dominguinhos/Alceu, ficha tipográfica autoral e QR local. São 11 posts no pool/10 por visita sem quiz. Calango: título, ano 2008, Fernando Miller e URL/canal confirmados por oEmbed e catálogos Canal Curta/Clermont-Ferrand; reprodução integral não testada. QR gerado localmente com qrcode 8.2 a partir do URL exato; totem permanece na exposição e não abre navegação YouTube livre. Sinopse e identificação locais; vídeo requer internet no celular. Sem vídeo, áudio, frame ou cartaz protegido no cache. PENDENTE: miniatura/cartaz/frame autorizado do filme; ficha tipográfica é identificada como tal. Não afirmar titularidade jurídica do canal apenas com oEmbed. Build/lint/tipos e testes foram executados; conferir resultados no registro final.

### Fase 7 — fotos e rastreabilidade
Arquivos: PostImage/Artwork, App, MapExplorer (paths cartográficos pré-calculados), EconomyContext; catálogos/modelo/pools; scripts/audit-content.mjs; public/content/image-manifest.json e IMAGENS-POR-POST.md. Todas as 90 associações validadas com imagem local, legenda, fonte, licença registrada e campos de procedência por post. Nenhum post climático nem painel literário usa arte sintética como fato. Fotos adicionais de Anastácia, triângulo e zabumba; retrato específico de Anastácia resolveu a lacuna da fase 6. Inspeção de contato das fotos realizada; fontes originais e lotes preservados. Lint corrigiu uso de console no script Node por import explícito; lint, 55 testes e build/tipos aprovados. PENDENTE: capas/encenações autorizadas de Santo/Uma Mulher e frame/cartaz de Calango, fotografia indígena e algumas imagens de contexto/baixa resolução. Identificação específica registrada; não declarar 100% dos assuntos documentados por retrato direto.

### Fase 8 — revisão factual e literária
Arquivos: content/index.ts (fonte biográfica de Patativa e fonte Canudos nos marcos), editorial-sources.json, este registro. Datas centrais cruzadas com ABL/UFPE: 1927/2014, Uma Mulher1947, Auto1955, Santo1957, Armorial1970 e Pedra1971. Adaptação televisiva1999 confirmada na Memória Globo; não repetir como1994 a informação inconsistente do registro bibliográfico ABL. Calango2008/FernandoMiller, AsaBranca1947/Gonzaga-HumbertoTeixeira, Xote1953/Gonzaga-ZéDantas e Anunciação/AnjoAvesso1983 conferidos em catálogos/instituições/artista. Funceme FAQ confirma que chuva no dia de São José não determina a quadra chuvosa. Nenhuma letra ou citação literal foi acrescentada; trava de direitos preservada. Revisão de linguagem mantém distinções Nordeste/Sertão/Semiárido/Caatinga e exemplos locais. PENDENTE: aprovação pedagógica por responsável e ensaio com11–15anos; textos permanecem review-pending, não aprovados por teste automatizado. Testes de direitos seguem passando.

### Fase 9 — quiz e ranking compatíveis
Arquivos: experience-settings.json, content/index.ts/pool-schema.ts, domain/content.ts/rotation.ts/visit.ts e evolution.test, App. quizEnabled e rankingEligible separados em dados: seis temas-base competitivos; Música/Festas livres. Validação de themeId fechado e quizEligible dos posts; sorteio continua restrito aos IDs exibidos e três níveis. Ranking conserva chave/formato/versão de regras e máximo18, sem pontuar vídeo/contagem de posts. Sessõesv2 são migradas sem apagar respostas/ranking; teste comprova18acertos preservados. Sem backend ou ranking online; validação em servidor/Supabase não se aplica nesta entrega. Lint,55unitários e tipos/build aprovados.

### Fase 10 — validação automatizada em andamento
Arquivos: e2e/helpers.ts, museum/rotation/leaderboard.spec.ts e novo evolution.spec.ts; package.json. E2E atualizado para contagens variáveis e oito cards; novos testes de mapas por toque/teclado/offline, cisterna, percursos livres, QR sem navegação externa, acessibilidade responsiva e atualização PWA adiada à Home. npm run lint, typecheck, validate:content, test:offline (1/1), build e npm test (55/55) aprovados. Suite E2E executada em GitHub Actions com o servidor local do pacote offline, sem publicação. Limite: não há control-browser disponível neste ambiente; não foi iniciado navegador/servidor improvisado para QA local. Não declarar inspeção visual da UI ou leitura em1,5m/ambiente iluminado sem ensaio. Avisos de bundle de dados cartográficos e PURE do Zod não são falhas; performance no equipamento definitivo pendente.

### Ajuste solicitado durante a validação — capela
Capela/sobrado Fazenda Acauã, Aparecida/PB, foto2015 Rogerio121402, CC BY-SA4.0, fonte Commons individual. Substitui a capa de Festas e Religiosidade e ilustra o post obrigatório festas-11; origem P&B preservada, sem confundir com Juazeiro ou festa em andamento. Créditos das fotos de capa acessíveis na Home. Arquivos: catálogo evolution-assets, pools/index, App/estilos, foto local, manifesto/tabela e teste E2E da capa.

### Proteção da entrega de revisão
O target legado staging planejava reassociar o alias estável; tentativa dpl_GSWL5TgYJTNduTAUo4gP3A5tR3H9 cancelada antes da publicação e alias antigo confirmado. API rejeitou target=preview. Documentação oficial REST informa preview como target ausente. Revisão automática bloqueou chamada ausente por risco de produção. Acrescentado require-preview.mjs: build falha antes de publicar se VERCEL_ENV não for exatamente preview. Mantém um único projeto e não altera main. Não remover a trava sem ordem de produção.

### Validação final e correções de acessibilidade
A primeira CI (`38952706458`) aprovou lint, tipos, conteúdo, 55 unitários, servidor e build, mas falhou em 1 de 27 E2E: o texto de descoberta em Festas tinha contraste calculado 4,31:1 durante a animação. Correção: entrada por deslocamento sem desaparecer o texto e ocre mais escuro em Pessoas/Festas; não se flexibilizou a regra axe. A inspeção de capturas revelou destaque nativo de toque no SVG cobrindo um marcador; removido o destaque e criado foco visível no círculo. Corrigido também texto antigo “cinco posts” no formulário vazio do ranking.

Capturas da primeira execução conferidas: Home desktop/celular, mapa de sub-regiões, cisterna, QR do vídeo e quiz. Novas capturas dos dois percursos em três resoluções acrescentadas para revisão após a correção. Nenhuma captura substitui ensaio físico.

### Fase 11 — documentação e pacote portátil
README, AGENTS, ARQUITETURA_VERCEL, TELAS_E_UX, MODELO-CONTEUDO, LITERATURA_E_DIREITOS, IMPLEMENTACAO, checklist e fontes descrevem agora oito percursos/90 posts. LOTES-IMAGENS registra o arquivo histórico das artes sintéticas. IMAGENS-POR-POST apresenta 90 associações com fonte/licença/status. PENDENCIAS-CURADORIA concentra limites editoriais, cartográficos e jurídicos.

O empacotador não instala nem baixa componentes. Confere SHA256 do runtime oficial Windows 22.23.3, inclui o dist validado, iniciador, servidor, licenças, documentação e CHECKSUMS de todos os arquivos. O leitor extrai em F: (se houver), abre INICIAR-MUSEU.cmd e usa localhost; textos, mapas, imagens e quizzes estão locais desde a primeira abertura. Vídeo/links externos continuam dependentes de rede no celular. O runtime Windows não foi executado no ambiente Linux; ensaio no display segue aberto.

### Resultado confirmado
CI após correções: https://github.com/GuxtavoPereira/Flic-Suassuna-2026/actions/runs/38953749503 — todos os passos aprovados, **27/27 E2E**, sem relaxar axe. CI com capturas complementares: https://github.com/GuxtavoPereira/Flic-Suassuna-2026/actions/runs/38953920004 — todos os passos aprovados. Código testado e7172886d43062ee4ee8375555a294efdb28aacf; commits seguintes apenas de documentação/empacotamento, sem alterar o app.

Comandos aprovados: lint, typecheck, validate:content (90 posts/8 temas), npm test (55/55, repetido após build para verificar precache novo), test:offline (1/1), build (113 entradas de precache, cerca de15,5MiB), test:e2e (27/27). Avisos de chunk cartográfico e comentários PURE do Zod registrados, sem falhas. Revisão React: hooks/listeners com limpeza, imagens com alt/legenda/fallback, diálogo nativo, contratos TypeScript, paths geográficos calculados fora de render e ranking versionado.

Conferência visual final de capturas: Home1920/celular, mapa1920 (marcador sem sobreposição), cisterna, QR, quiz, ranking móvel, Festas1920/390 e Música1024. Grade de oito cards preservada; rolagem vertical disponível. Modo celular do ranking usa região de tabela com rolagem horizontal acessível; não transborda a página. Sem alegar teste manual no Windows/display.

Pacote preliminar conferido por CRC, SHA256 de154arquivos e comparação byte a byte dos134arquivos de dist; capela incluída e runtime oficial com hash esperado. Reconstruir e repetir essa verificação após a atualização final deste checklist. As pendências permanecem abertas e nenhuma URL de preview foi inventada.


### Nova autorização — publicação pública em 16/10/2026
Após a entrega offline, o proprietário solicitou acesso online e autorizou expressamente: “Pode alterar o site publico para a nossa nova versão para que outras pessoas consigam acessar também”. Esta ordem substitui a restrição anterior de Preview. Preview isolado dpl_7XovEmqNvPtRgyzDFe1iaVhjVcio criado a partir de805a1cd, sem reassociar o endereço estável.

Guard renomeado para require-deployment-target.mjs e limitado a preview/production; destinos ausentes/desconhecidos continuam bloqueados. Nenhum componente, conteúdo, chave de ranking, precache ou arquivo de aplicação foi alterado para liberar a publicação. Produção usará target=production explícito, com os mesmos gates de lint/unitários/servidor/build/E2E antes de entrar no ar.


### Publicação pública confirmada
Deployment dpl_4LdHgvLZkBW71D6ZNNESJPxs6C6g, target production explícito, commit ad79d56f330b9416e2aa5899c578f825885f2fff. A autorização do proprietário resolveu a restrição anterior; o Preview separado foi cancelado para priorizar a fila de produção. O endereço estável foi conferido pela API e por HTTP sem cookies/autenticação.

URL: https://flic2026-sertao-guxtavopereira.vercel.app

GitHub CI38957146380 aprovou todos os gates do commit de publicação. A Vercel também executou lint,55unitários, servidor, build e27E2E antes da liberação. Conferência HTTP: título novo, manifesto de90posts, manifesto PWA, seis rotas internas, assets JS/CSS/imagens idênticos ao build validado, QR local e SW com capela e cabeçalho de atualização sem cache. Os detalhes estão no registro local public-release-validation.json.

Nenhum componente/conteúdo foi alterado para a publicação: guard de destino e documentação foram as únicas mudanças após os testes anteriores. A versão offline continua com os mesmos134arquivos do site; documentação do ZIP sincronizada com a publicação. O ranking permanece local e a migração preserva dados compatíveis. Pendências pedagógicas, de cartografia e imagens autorizadas continuam abertas.


### Ajustes solicitados após publicação — mapas, display e QR
Referências anexadas conferidas. Implementados quatro polígonos didáticos coloridos, seleção de estado diretamente no SVG e nos botões (cor, halo/contorno, status com nome/sigla e ampliação do Nordeste), grade horizontal4×2 e QR global Ver no celular. As quatro geometrias vêm de Brazil Region Nordeste Subregions.svg, Raphael Lorenzeto de Abreu,2006, licença CC BY2.5 conferida na página Commons em16/10/2026; não foram desenhadas por adivinhação. Contornos mantidos e escala de coordenadas alterada; polígonos3/4 conferidos pela numeração do original e teste geométrico dos quatro pontos de rótulo. Gráfico vetorial renderizado e inspecionado antes de integrar.

QR local gerado pelo ReportLab para a URL pública canônica; disponível no pacote offline, com aviso de que o celular precisa de rede. Nenhum áudio/vídeo novo nem mudança em quiz/ranking. Lint/tipos, conteúdo, build,56unitários e servidor aprovados antes dos E2E novos. Conferência visual da UI e E2E horizontal/toque/QR ainda pendentes nesta etapa; não marcar aceites completos por inferência.


### Verificação do display e QR — correções observadas
A CI38961749511 aprovou28/29E2E: os oito cards ultrapassavam a altura de768px. Ajustados espaçamentos, títulos e ocultação dos subtítulos apenas em displays horizontais baixos; a regra de aceite não foi relaxada. CI38985823025 aprovou29/29E2E,56unitários, lint, tipos, conteúdo, servidor e build. Capturas Home1920/1366/390, quatro sub-regiões e QR conferidas: oito escolhas cabem na altura dos displays horizontais; números/cores/contorno e botões sincronizados visíveis; QR tem margem branca e URL explícita. A captura de1366 tem rodapé/créditos abaixo da primeira tela, mas todos os oito cards estão visíveis.

O teste do QR passa com o display desconectado; o aviso de internet no celular permanece visível e fechar conserva a página. Não foi alegado escaneamento por aparelho físico. Ícone de seleção substitui glifo sem suporte na fonte de teste. A revisão do estado selecionado revelou corte do extremo sul da Bahia na ampliação; viewBox ampliado de19 para20 unidades, sem mudar geometrias ou fronteiras. Nova CI38986103221 e deployment dpl_3yiTQgBjVRYH8c6E1gqMjJp88Ze1 validam esse ajuste final antes da entrega.


### Resultado final da interface
CI https://github.com/GuxtavoPereira/Flic-Suassuna-2026/actions/runs/38986103221 aprovada integralmente: lint, tipos, conteúdo90posts/8temas,56unitários antes/depois do build, servidor1/1, build e29/29E2E. Commit de aplicação495a934da055d64b2b471bda38c70c3e9ab1bb4c; árvore4cdb7da52ad7fcd6deca73bc5beb15e61a88e7c2 idêntica à árvore local validada. Artefato12083730107 conferido por SHA256 d0188b7ef1686d4303f888781bd0c13b421c24bca33c6d02db28edafde8a7cdc. Captura final de Pernambuco selecionado revisada: Bahia inteira, preenchimento/halo/contorno visíveis e botão/status sincronizados. Documentação posterior não altera aplicação.

Revisão React dos componentes alterados: diálogo nativo com título acessível e retorno de foco; useId para IDs de descrições; teclado Enter/Espaço e aria-pressed nos controles SVG; dados cartográficos e paths estáticos fora do render; overlays sem interceptar toque; QR e dados sem requisições externas. Ranking, sessões e chaves preservados. Ensaio físico/pedagógico continua pendente.


### Publicação dos mapas, display e QR
Produção dpl_3yiTQgBjVRYH8c6E1gqMjJp88Ze1 concluída, commit495a934da055d64b2b471bda38c70c3e9ab1bb4c, target production explícito. Logs Vercel:29/29E2E em7minutos e build completo; alias público confirmado apontando para esse deployment. Endereço: https://flic2026-sertao-guxtavopereira.vercel.app/ . Nenhuma dependência foi instalada no computador do usuário. O pacote portátil é reconstruído com esse dist, incluindo QR local e mapas novos, e verificado por CRC/SHA256 e comparação dos113arquivos do app. Não contém capturas de QA nem dependência de autenticação Vercel.

Conferência HTTP pública concluída sem cookies/login:200, HTML e dez assets idênticos ao dist local (incluindo site-qr.svg), seis rotas SPA, manifesto de90posts e SW com QR/capela e atualização sem cache. Pacote portátil:113arquivos de dist comparados byte a byte,133arquivos conferidos por SHA256 e CRC íntegro; runtime oficial com hash esperado. A documentação final é incorporada e a mesma verificação é repetida antes de salvar a entrega.


### Correção após relato do visitante — modo do mapa entre posts
O mapa colorido estava publicado e testado na rota dedicada, mas o carrossel reutilizava a mesma instância de MapExplorer entre clima-09 e clima-10. useState(initialMode) conservava o modo Brasil ao mudar o post; o segundo post aparecia em terracota até selecionar a aba manualmente. A inspeção anterior da rota dedicada não cobria esse caminho e o aceite do carrossel foi prematuro.

Correção: key=slide.id em MapExplorer para iniciar o modo correspondente a cada post. Teste de regressão percorre a navegação real, altera um estado, avança para as quatro sub-regiões sem clicar na aba, confere quatro cores computadas, volta, avança e recarrega, tudo sem rede após precache. Captura específica subregions-post-1920 será conferida após a execução remota. Geometrias, paleta, perguntas, pontuação e chaves de sessão não alteradas.

CI38988317488 do commit7de3f019bd6a515e89d7c9ca1f9332af84ca3b60 aprovada: lint/tipos/conteúdo,56unitários, servidor, build e30/30E2E. O novo caso de regressão passou no carrossel offline; também passou no build Vercel. Captura e publicação final ainda em conferência nesta etapa.

Captura subregions-post-1920 da CI38988317488 conferida: ao chegar pelo carrossel, a aba Quatro sub-regiões já está ativa e as quatro áreas estão preenchidas em laranja/amarelo/lilás/verde, com legenda/painel sincronizados. Artefato12083513656 verificado por SHA25603cdaa91573ae00c91ff76606a39a0c37532c8198e22009af0ea53cf2c9319ca.


### Correção do carrossel publicada
Deployment dpl_F5RW1cb68bFD4nfDus1oQesmXGkw em READY, target production explícito, commit7de3f019bd6a515e89d7c9ca1f9332af84ca3b60. Alias público confirmado para esse build. Vercel aprovou30/30E2E (7,2min), além dos gates de lint,56unitários, servidor e build. CI38988317488 também aprovada integralmente. O teste anterior cobria o mapa isolado; esta validação inclui a transição entre os posts reais, com captura e teste offline, voltar/avançar e recarregamento.

Pacote offline reconstruído com o dist corrigido. CRC,133checksums e113arquivos do app são conferidos novamente antes de substituir o ZIP entregue. O ensaio físico e as pendências de curadoria continuam abertos; não dependem desta correção de estado do componente.
