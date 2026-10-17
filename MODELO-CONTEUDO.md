# Modelo de conteúdo e sessão

## Posts

`pools.json` versão 3: `id`, `themeId`, `topicId`, `title`, `body`/`text`, `curiosity`, `assetId`, `tags`, `type`, `postType`, `status`, `editorialStatus`, `quizEligible`, `introductory`, `required`, `order`; opcionais `experience` e `imageContext`. A normalização entrega `image`, `alt`, `source`, `imageCredit`, `imageLicense` e `sourceMetadata` à interface. Referências editoriais são IDs em `source`.

`assetId` resolve um catálogo com caminho local, autor, fonte, licença, legenda e natureza do registro. `imageContext` explica quando uma foto documenta apenas um local, pessoa ou documento relacionado. `scripts/audit-content.mjs` gera `public/content/image-manifest.json` com os campos de procedência por post e `IMAGENS-POR-POST.md`. Não aprova editorialmente um texto apenas por existir uma referência.

Temas canônicos: clima-vegetacao, cultura, personalidades, linha-do-tempo, culinaria, ariano, musica-audiovisual, festas-religiosidade. O alias clima e os demais aliases antigos permanecem. Não criar tema órfão por digitação.

## Sorteio e perguntas

Uma introdução e os posts marcados `required` entram na rodada. Complementos priorizam IDs não recentes e assuntos diferentes; um fallback finito preenche com posts disponíveis sem duplicar IDs. `order` preserva sequência pedagógica. O conjunto é fixo durante a visita/recarregamento.

Perguntas têm quatro alternativas distintas, índice canônico correto, feedback, nível1/2/3, themeId/topicId e postIds. A rodada competitiva exige uma de cada nível e referência a post exibido/elegível. Só começa quando todos os posts selecionados foram vistos. Alternativas e questões são embaralhadas sem reinterpretar o índice salvo.

`quizEnabled` permite quiz por card. `rankingEligible` separa o conjunto competitivo; alterar essa regra requer nova versão de ranking e revisão de compatibilidade, não uma mudança casual. Os novos percursos permanecem livres nesta edição.

## Persistência e migração

Chaves mantidas: sessão `flic-visit-v2`, histórico `flic-recent-content-v2`, ranking `flic-leaderboard-v1`. O documento de sessão agora grava versão3. Versão2 compatível conserva visitId, respostas, perguntas/alternativas, post atual e rankingAnswers, ampliando a lista de posts e incluindo temas novos. Novos posts devem ser lidos antes de outro quiz. Sessão inválida reinicia só a visita; ranking e preferências não são apagados.

Histórico anônimo limita120IDs por tipo. Primeira rodada concluída de um tema-base fica congelada para ranking; treino não a melhora. Até18acertos/6temas e categorias por quantidade concluída. Registros antigos continuam separados por regras. Não há identidade autenticada nem antifraude online; a camada de repositório permite integração futura, que exigirá validação de servidor.

## Mapas e audiovisual

GeoJSON oficial local em `src/content/maps/`, com fontes, vintages, simplificações e limites em metadata.json. Não converter figura didática sem método em polígono oficial. Pontos são centroides municipais oficiais, não limites ou sedes precisas.

`videos.json` registra referência externa de Calango; a interface usa sinopse/ficha locais e QR para o celular. Uma nova referência precisa de URL/canal/título/data verificáveis, direitos documentados para qualquer imagem baixada e teste do fluxo offline. Não incluir mídia protegida no precache por existir publicamente na web.

`maps/subregions.json` guarda quatro paths SVG e nove contornos estaduais extraídos da obra de Raphael Lorenzeto de Abreu (2006), CC BY2.5. Coordenadas de desenho, sem georreferenciamento. Metadados preservam URL, autoria, hash do original e modificações. Não converter esse desenho em limites oficiais. `site-links.json` centraliza o endereço público e o QR local exibido no cabeçalho.
