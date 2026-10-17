# Checklist de evolução — O Sertão de Ariano Suassuna | FLIC 2026

> **Arquivo para execução no Codex.** Atualizar o site já existente, sem recriar o projeto do zero, mantendo um único projeto Vercel e funcionamento offline. Marcar `[x]` **somente** após implementar, conferir visualmente e testar. Quando faltar fonte, licença, fotografia ou conteúdo confiável, registrar `[ ] PENDENTE` — não inventar material.

**Público:** estudantes de 11 a 15 anos e visitantes da feira.  
**Identidade visual:** fundo branco-quente/creme, traços de xilogravura e cores pontuais (terracota, ocre, verde, azul); contraste suficiente para totem em ambiente iluminado.  
**Prioridade:** `P0` bloqueante; `P1` importante; `P2` aprimoramento.  
**Premissa de escopo:** **8 cards na Home** = 6 atuais + 2 novos (*Música e Audiovisual* e *Festas e Religiosidade*). **8 posts no mínimo por card**; alguns terão mais. Economia/convivência com a seca será uma seção reforçada no módulo de Clima, com referências cruzadas em Cultura e Culinária, sem criar um nono card nesta etapa.

**Registro de validação — 16/10/2026:** execução por fases documentada em AUDITORIA-EVOLUCAO.md. Evidências de CI e inspeção visual de capturas em telas 1920/3840/1024/390 px; não equivalem ao ensaio no equipamento escolar. Caixas incompletas permanecem abertas. Publicação em produção autorizada posteriormente pelo proprietário e validada em https://flic2026-sertao-guxtavopereira.vercel.app; pacote portátil Windows preparado com o mesmo build validado.

---

## Fase 0 — Levantamento do código e segurança da alteração [P0]

- [x] Ler os arquivos disponíveis: `README.md`, `AGENTS.md`, `ARQUITETURA_VERCEL.md`, `TELAS_E_UX.md`, `CONTEUDO_MODULOS.json`, `LITERATURA_E_DIREITOS.md` e os componentes reais do repositório.
- [x] Inspecionar a Home, rotas, card/carrossel, modelo de posts, pool de perguntas, quiz, ranking e PWA atuais; **não presumir que a documentação seja idêntica ao código**.
- [x] Mapear os IDs existentes (`clima`, `cultura`, `personalidades`, `linha-do-tempo`, `culinaria`, `ariano`) e conservar URLs e progresso onde possível; prever migração se houver mudança de esquema.
- [x] Fazer um levantamento das fotos já disponíveis, arquivos WebP, fontes e licenças; não sobrescrever fotografias reais com arte de IA por engano.
- [x] Executar e registrar o resultado de testes/lint/build **antes** de alterar; separar erros preexistentes de regressões.
- [x] Criar checklist de tarefas no PR ou issue e registrar arquivos modificados por fase.

**Aceite:** diagnóstico do projeto existente e plano de migração documentados, sem perda de rotas ou conteúdo.

## Fase 1 — Identidade, Home e navegação [P0]

- [x] Alterar o **título principal visível** para **`O Sertão de Ariano Suassuna`** em Home, cabeçalho, título do navegador (`document.title`), metadados, manifesto PWA e conteúdos institucionais pertinentes.
- [x] Manter **`FLIC 2026`** como assinatura/subtítulo da exposição; retirar o título antigo de conteúdos de interface, preservando créditos e histórico de documentação quando fizer sentido.
- [x] Atualizar Home para **8 cards**, em grade grande e adaptável (ex.: 4×2 em 1920×1080), sem textos ou controles espremidos.
- [x] Manter os cards originais: `Clima e Vegetação`, `Cultura do Sertão`, `Figuras Influentes`, `Linha do Tempo`, `Culinária Nordestina`, `Vida e Obras de Ariano Suassuna`.
- [x] Adicionar os cards `Música e Audiovisual Nordestino` e `Festas e Religiosidade` com imagens e rotas próprias.
- [x] Manter paleta clara e contraste AA em textos/controles; não voltar ao fundo preto.
- [x] Manter navegação touch: botões grandes, swipe **opcional**, indicação `post X de Y`, botão Início/Voltar sempre visível e foco de teclado.
- [x] Exibir indicador de progresso correto com 8, 10, 12 ou mais posts; não assumir sequência fixa de 5.

**Aceite:** título correto, 8 cards funcionais, navegação acessível e sem regressões em telas grandes e menores.

## Fase 2 — Conteúdo: pelo menos 8 posts por card [P0]

- [x] Ampliar cada um dos 6 módulos existentes de 5 para **8 ou mais posts**; inserir 2 módulos novos com **8 ou mais**.
- [x] Criar conteúdos **curtos, objetivos, com uma ideia por tela**, curiosidade útil, imagem vinculada e fonte editorial rastreável.
- [x] Preservar o conteúdo já validado; corrigir apenas o que for inadequado, incorreto ou duplicado.
- [x] Adotar campos `id`, `themeId`, `topicId`, `title`, `body`, `image`, `alt`, `source`, `imageCredit`, `imageLicense`, `postType`, `editorialStatus`, `quizEligible` (adapte o esquema existente com migração).
- [x] Manter pools de posts e perguntas relacionados por `topicId`; **nenhuma pergunta competitiva pode depender de post não exibido naquela sessão**.
- [x] Definir posts introdutórios fixos e posts complementares rotativos sem quebrar a sequência pedagógica; implementar fallback quando o pool for insuficiente.
- [x] Atualizar indicadores, miniaturas, tipagem, telas de resultados e testes para contagens variáveis.

### Cobertura editorial mínima por módulo

| Card | Quantidade | Assuntos de referência para criar os posts |
|---|---:|---|
| **1. Clima e Vegetação** | **12+** | Nordeste no mapa do Brasil; mapa das 4 sub-regiões; semiárido; Caatinga seca; Caatinga após a chuva; flora/fauna; relevo/rios; agricultura familiar e de subsistência; criação de animais; cisternas; tecnologias de convivência; economia diversa e infraestrutura |
| **2. Cultura do Sertão** | **8+** | oralidade, literatura de cordel, xilogravura, repente/cantoria, artesanato, saberes tradicionais, narrativas locais, Movimento Armorial; evitar duplicar os novos cards |
| **3. Figuras Influentes** | **8+** | Luiz Gonzaga, Patativa do Assaré, Rachel de Queiroz, Mestre Vitalino, Padre Cícero, Ariano Suassuna, Antônio Conselheiro e mais uma figura de relevância comprovada; contextualizar personagens e controvérsias |
| **4. Linha do Tempo** | **8+** | marcos históricos do sertão, Canudos, 1927, infância/juventude de Ariano, teatro, *Auto da Compadecida*, Movimento Armorial, *Pedra do Reino*, legado; distinguir data histórica de interpretação literária |
| **5. Culinária Nordestina** | **8+** | milho/cuscuz, macaxeira, baião de dois, carne de sol, queijo coalho, rapadura, umbu, alimentação familiar e festas; reconhecer diversidade de regiões e preparos |
| **6. Vida e Obras de Ariano** | **8+** | biografia, infância, trajetória cultural, *Auto da Compadecida*, *O Santo e a Porca*, *Romance d'A Pedra do Reino*, *Uma Mulher Vestida de Sol*, Armorial e legado |
| **7. Música e Audiovisual** | **10+** | baião/forró/xote, Luiz Gonzaga, Dominguinhos, outros artistas, canções clássicas, instrumentos, *Calango Lengo*, cinema e televisão ambientados no Nordeste, diversidade atual |
| **8. Festas e Religiosidade** | **10+** | São João, quadrilhas/forró, São Pedro, romarias, Padre Cícero, Nossa Senhora das Dores, Nossa Senhora Aparecida, devoção e chuvas, reisado, festas de padroeiro e diversidade religiosa |

**Aceite:** Home com 8 módulos navegáveis e **mínimo de 72 posts no conjunto** (12 + 8×5 + 10 + 10), sem telas vazias, sem textos repetidos como preenchimento e com identificação de fontes.

## Fase 3 — Mapas didáticos interativos [P0]

- [x] No módulo **Clima e Vegetação**, incluir post **Mapa do Brasil** com região Nordeste destacada e indicação pedagógica aproximada da área do sertão. — Brasil/Nordeste no primeiro modo; Sertão em amarelo no modo Quatro sub-regiões do mesmo explorador, com faixas aproximadas e fonte identificada.
- [x] Diferenciar, com legendas, **Nordeste (região político-administrativa)**, **sertão (sub-região/uso geográfico)**, **semiárido (delimitação climática oficial)** e **Caatinga (bioma)**. Não usar o mesmo contorno para todos.
- [x] Adicionar mapa das **4 sub-regiões tradicionalmente usadas em materiais didáticos**: **Meio-Norte, Sertão, Agreste e Zona da Mata**; explicar que é uma regionalização didática e que a delimitação depende da metodologia/fonte. — Quatro áreas coloridas/numeradas e painéis sincronizados; desenho de Raphael Lorenzeto de Abreu (2006), CC BY2.5, explicitamente aproximado e sem georreferenciamento.
- [x] Ao tocar em cada sub-região, apresentar clima, vegetação, atividades econômicas, paisagens e um exemplo de localidade — sem generalizar que todos os municípios são iguais.
- [ ] **PENDENTE:** Usar dados cartográficos georreferenciados de fontes confiáveis (IBGE e órgãos competentes), com data/fonte na interface e nos metadados. Não desenhar fronteiras por adivinhação. — Bases oficiais identificadas; confirmar condições específicas de redistribuição do produto temático Caatinga.
- [x] Criar interação **offline**, preferencialmente via SVG/GeoJSON local e botões acessíveis; não exigir Google Maps ou outra API externa.
- [x] Disponibilizar legenda de cores, foco de teclado, descrição textual equivalente e alternativa de navegação por lista.
- [x] Em telas menores, permitir seleção legível sem gestos de zoom difíceis para crianças.

**Aceite:** ambos os mapas funcionam sem conexão após pré-cache, distinguem conceitos e oferecem quatro painéis de sub-regiões.

## Fase 4 — Economia do sertão e convivência com o semiárido [P0]

- [x] Criar seção narrativa identificável no carrossel climático, com links para cultura/cotidiano, **sem transformar o sertão em estereótipo de sobrevivência precária**.
- [x] Mostrar **agricultura familiar e de subsistência**: milho, feijão, mandioca, manejo da água, diversidade de cultivos e sementes locais.
- [x] Mostrar **pecuária** e uso dos animais: caprinos, ovinos, bovinos e outros exemplos locais; funções econômicas, alimentação e adaptações ao ambiente; diferenciar subsistência de produção comercial.
- [x] Explicar **cisternas**: coleta de água de chuva, água para consumo humano e água para produção; diagramar uma cisterna, calhas e reservatório com foto real e legenda.
- [x] Abordar **tecnologias e infraestrutura** de convivência com a seca: barragens, açudes, reúso responsável, sistemas de irrigação adequados, captação e armazenamento; indicar limites e impactos.
- [x] Valorizar trabalho, feiras, artesanato, serviços e outras atividades econômicas do sertão contemporâneo; não reduzir a economia à criação de animais.
- [ ] **PENDENTE:** Adicionar fotos reais verificadas das técnicas e das pessoas que as utilizam, com procedência e contexto geográfico. — Fotos de técnicas presentes; faltam registros específicos de serviços e trabalho com regime familiar comprovado.
- [x] Conferir fontes em instituições como MDS, Embrapa, ASA, IBGE, universidades e centros de pesquisa.

**Aceite:** visitantes compreendem como as pessoas trabalham, produzem e convivem com o clima, com exemplos atuais e cientificamente consistentes.

## Fase 5 — Religião, Padre Cícero e festividades [P0]

- [x] Criar card **Festas e Religiosidade**, com no mínimo 10 posts (quiz **opcional**, configurável por card).
- [x] Destacar **Padre Cícero (Padim Ciço)**, Juazeiro do Norte, romarias, vida social e importância da religiosidade popular; explicar controvérsias históricas sem emitir juízo de fé.
- [x] Apresentar a devoção a **Nossa Senhora Aparecida** como manifestação de alcance nacional com presença também no Nordeste, sem confundi-la com padroeiras e devoções locais.
- [x] Incluir **Nossa Senhora das Dores** e outras devoções contextualizadas (ex.: Candeias, festas de padroeiro); identificar cidade, história e celebração.
- [x] Mostrar como orações, promessas, procissões e devoções à chuva são vivenciadas em comunidades — **separando crenças religiosas de causas meteorológicas**.
- [x] Abordar **São José e crenças populares sobre a quadra chuvosa**, caso haja fontes locais consistentes; não formular previsões meteorológicas com base na devoção.
- [x] Apresentar São João, São Pedro, quadrilha, fogueira, comidas e música com ligação à sociabilidade e às diferentes tradições regionais.
- [x] Considerar reisado, festas religiosas comunitárias e expressões de diferentes tradições (católicas, evangélicas, afro-brasileiras, indígenas e outras), sem tratar o Nordeste como culturalmente homogêneo.
- [ ] **PENDENTE:** Usar fotos reais de festas, romarias, patrimônio e comunidades com fonte, licença, local e ano quando disponíveis. — Fotografias locais/licenciadas presentes; faltam prática indígena autorizada e melhor resolução de São Pedro.
- [x] Evitar tornar a interface devocional: a abordagem é **cultural, histórica e educativa**, respeitosa com todas as crenças.

**Aceite:** o card celebra as festividades e explica o papel da fé de forma respeitosa, contextualizada e diversa.

## Fase 6 — Música e audiovisual nordestinos [P0]

- [x] Criar card **Música e Audiovisual Nordestino** com **10 ou mais posts** de curiosidades; **não exigir quiz** nem pontuação nele.
- [x] Apresentar música com fotos reais de artistas, identificação de **artista, obra, compositor quando pertinente, ano e contexto**: repertório sugerido para pesquisa — *Asa Branca*, *Xote das Meninas*, *Eu Só Quero um Xodó*, *Anunciação* e outros clássicos selecionados por curadoria.
- [x] Explicar forró, baião, xote e instrumentos (sanfona, zabumba, triângulo), além de outros gêneros e manifestações nordestinas; não reduzir todo o Nordeste a um só gênero.
- [x] Destacar o curta **_Calango Lengo: Morte e Vida sem Ver Água_ (2008)**, com título corrigido, sinopse breve, autoria verificada e vínculo oficial quando possível.
- [x] Incluir audiovisual de ficção e produções ambientadas no Nordeste (ex.: adaptações de *Auto da Compadecida*, novelas e filmes relevantes); **distinguir uma obra de Ariano de produções de outros autores**.
- [x] Selecionar links reais e verificáveis do YouTube, preferencialmente do artista, estúdio, emissora ou distribuidor; armazenar `url`, `channel`, `videoTitle`, `verifiedAt` e `licenseNote`; não inventar URLs.
- [ ] **PENDENTE:** Exemplo já verificável para pesquisa: [*Calango Lengo* — BAGUM SABOA animações](https://www.youtube.com/watch?v=hj1fyV3pvSM). Validar canal/disponibilidade antes da publicação. — URL/título/canal confirmados por oEmbed; reprodução integral e titularidade jurídica do canal não conferidas.
- [ ] **PENDENTE:** Mostrar miniatura e resumo **locais** no modo offline; o botão **“Assistir no YouTube”** deve avisar que precisa de conexão. — Resumo e ficha tipográfica locais; miniatura/frame/cartaz do filme sem permissão obtida.
- [x] Em totem público, abrir links externos em fluxo controlado, com retorno inequívoco à exposição e proteção contra navegação livre não supervisionada; avaliar oferecer QR code para assistir no celular do visitante.
- [x] Não baixar vídeos ou músicas de terceiros para o cache offline sem licença explícita; não usar letras de músicas extensas nem material visual protegido sem base jurídica adequada.
- [x] Considerar efeitos de som opcionais, sempre com modo mudo como padrão do totem.

**Aceite:** módulo com 10+ posts, imagens específicas, ao menos uma referência audiovisual verificada, links funcionais e retorno seguro à navegação.

## Fase 7 — Política de fotos reais e imagens por post [P0]

- [x] Trocar **todas as ilustrações geradas por IA usadas como representação factual de Clima e Vegetação** por **fotografias reais** de paisagens, plantas, animais e fenômenos compatíveis com cada post.
- [ ] **PENDENTE:** Selecionar ao menos **uma imagem específica por post** (fotografia ou reprodução autorizada conforme tema); não reciclar a mesma imagem genérica para umbuzeiro, cuscuz, cisterna, mandacaru, etc. — 90 imagens temáticas locais; algumas obras e pessoas têm contexto identificado, sem reprodução direta autorizada.
- [ ] **PENDENTE:** Nas outras áreas, manter xilogravura como recurso de identidade visual, mas **usar fotos reais** quando o post tratar de pessoa, evento, obra, registro histórico ou produção audiovisual específica. — Fotos e documentos reais presentes; reprodução direta de alguns eventos/obras ainda ausente.
- [ ] **PENDENTE:** Para obras de Ariano, preferir registros documentais, cartazes/capas/encenações **legítimos e identificados**, sem confundir fotografia de adaptação com registro da obra teatral original. — Santo e Uma Mulher usam contexto identificado; faltam capas ou encenações autorizadas.
- [x] **Nunca apresentar imagem criada por IA como foto histórica, fotografia documental ou retrato real**; se usada como ilustração, rotular explicitamente.
- [x] Manter metadados por asset: `postId`, `assetPath`, `subject`, `alt`, `caption`, `creator`, `sourceUrl`, `license`, `usagePermission`, `place`, `date`, `assetType` e `editorialStatus`.
- [x] Verificar origem/condições de uso das fotos; **crédito não substitui licença**, e página pública não significa domínio público.
- [x] Gerar versões otimizadas WebP/AVIF a partir de originais autorizados, preservando proporções e nitidez no totem; guardar manifesto de arquivos.
- [x] Evitar URLs externas como fonte única de imagens: incluir assets locais permitidos no pré-cache PWA, com fallback visual quando um asset faltar.

**Aceite:** 100% dos posts possuem imagem temática e metadados; os posts climáticos exibem fotos reais; nenhuma arte sintética é rotulada como documento histórico.

## Fase 8 — Conteúdo literário e precisão factual [P1]

- [x] Manter Ariano Suassuna como fio condutor da exposição, sem forçar relações diretas entre obras e eventos sem documentação.
- [x] Conferir datas, títulos, nomes de obras, falas e citações em fontes confiáveis; não inventar aspas atribuídas ao autor.
- [x] Incluir trechos curtos apenas quando juridicamente cabíveis ou autorizados, sempre com atribuição, obra e referência de edição quando disponível.
- [x] Revisar termos: **Nordeste ≠ sertão ≠ semiárido ≠ Caatinga**.
- [x] Evitar associação automática de todos os elementos culturais e religiosos a todo o Nordeste.
- [ ] **PENDENTE:** Ajustar linguagem para estudantes do 6º ao 9º ano e revisar ortografia antes de marcar post como aprovado. — Revisão inicial realizada; aprovação final do educador e ensaio com 11–15 anos pendentes.

**Aceite:** todos os fatos centrais têm referências e todos os textos exibidos foram revisados.

## Fase 9 — Quiz, ranking e atualização dos dados [P1]

- [x] Manter quiz para os seis módulos-base, com questões ligadas exclusivamente aos posts realmente vistos.
- [x] Tornar `quizEnabled` configurável por card: **desativado por padrão no novo módulo Música e Audiovisual**; opcional no módulo Festas e Religiosidade.
- [x] Garantir variedade de perguntas e evitar repetições consecutivas; conservar histórico local de sessões quando apropriado.
- [x] Não usar número de posts ou presença de vídeo como fator que aumente pontuação ou privilegie certos participantes.
- [ ] **PENDENTE:** Preservar compatibilidade com ranking existente e futura integração Supabase; validar pontuações no servidor para ranking online. — Compatibilidade local testada; não existe ranking online/Supabase nem validação de servidor nesta entrega.
- [x] Atualizar arquivos JSON/TypeScript e scripts de validação; `themeId` e `topicId` não podem ficar órfãos.

**Aceite:** novos cards sem quiz não mostram telas vazias nem interferem no ranking; quizzes existentes continuam funcionando.

## Fase 10 — Offline, performance, acessibilidade e testes [P0]

- [x] Preservar hospedagem em **um único projeto Vercel**, React + TypeScript + Vite e PWA offline-first; não criar backend/banco como dependência para esta entrega.
- [x] Pré-carregar mapas, conteúdo textual e imagens autorizadas; exibir claramente a indisponibilidade de links YouTube quando offline.
- [x] Validar sem internet em sessão nova **após** pré-cache, e após atualização do PWA sem interromper uma visita em andamento.
- [ ] **PENDENTE:** Garantir botões grandes, foco visível, navegação por teclado, alternativas a gestos e texto legível a cerca de 1,5 m. — Toque/teclado/foco verificados automaticamente; leitura a 1,5 m depende do display real.
- [ ] **PENDENTE:** Testar o mapa por toque/teclado e seu equivalente textual; verificar leitura em ambiente iluminado. — Mapas por toque/teclado testados; ensaio em ambiente escolar iluminado pendente.
- [x] Testar 1920×1080 e resoluções menores, incluindo 8 cards, 12+ posts e navegação sem overflow.
- [x] Criar testes para estrutura de 8 módulos, contagem mínima de posts, assets/legendas existentes, fontes obrigatórias e habilitação opcional de quiz.
- [x] Executar `lint`, `typecheck`, testes unitários, testes E2E relevantes e build de produção; documentar comandos e resultados reais.
- [x] Conferir que nenhum link externo, vídeo ou thumbnail bloqueie o funcionamento da exposição local.

**Aceite:** conteúdo principal navega offline, funciona em totem e não apresenta regressões relevantes.

## Fase 11 — Entrega, documentação e definição de pronto [P0]

- [x] Atualizar `README.md`, `AGENTS.md`, especificação de telas, modelo de conteúdo, checklist e fontes, eliminando referências técnicas obsoletas a “6 cards” e “5 posts fixos”.
- [x] Entregar tabela `postId → imagem → fonte → licença/status`, inclusive pendências.
- [x] Registrar quais vídeos do YouTube são externos, quais verificações foram feitas e os comportamentos quando offline.
- [x] Listar novos componentes, rotas e arquivos, e como adicionar posts, mapas, imagens ou links sem alterar a UI.
- [x] Disponibilizar versão online para revisão em https://flic2026-sertao-guxtavopereira.vercel.app. **Escopo atualizado por ordem explícita do proprietário em16/10/2026:** publicação no endereço público autorizada; acesso sem login verificado. O Preview separado foi cancelado para priorizar a produção.
- [x] Apresentar ao final: tarefas concluídas, testes executados, conteúdos ainda sujeitos a curadoria, licenças pendentes e URL de preview **somente se realmente implantado**.

### Definição de pronto (DoD)

- [x] **Título:** `O Sertão de Ariano Suassuna`, com assinatura `FLIC 2026`.
- [x] **Home:** exatamente 8 cards no escopo atual; 6 originais + 2 novos.
- [x] **Conteúdo:** pelo menos 8 posts por card; Clima 12+, Música/Audiovisual 10+, Festas/Religiosidade 10+.
- [x] **Mapas:** Brasil/Nordeste/Sertão e quatro sub-regiões com descrições e uso offline. — Camadas oficiais e desenho didático licenciado têm modos separados; áreas aproximadas coloridas e painéis funcionam offline. Georreferenciamento sub-regional oficial e condições específicas do produto Caatinga continuam pendentes na fase3.
- [x] **Economia:** agricultura, pecuária/animais, cisternas, tecnologias, infraestrutura e atividades diversas contextualizadas.
- [x] **Religiosidade:** Padre Cícero, devoções marianas, fé e chuvas, São João e diversidade cultural representados com cuidado.
- [ ] **PENDENTE:** **Audiovisual:** clássicos musicais, *Calango Lengo*, filmes/novelas e links verificados, com modo offline seguro. — Referência e QR funcionais; reprodução integral e miniatura autorizada pendentes.
- [ ] **PENDENTE:** **Imagens:** foto real de Clima, documentação fiel dos assuntos, foto própria por post e metadados/licenças. — Imagens locais e manifestos presentes; documentação direta de algumas obras/práticas ainda pendente.
- [x] **Quiz/ranking:** nenhuma regressão; novos cards de curiosidades podem dispensar quiz.
- [x] **Qualidade:** lint, testes e build aprovados; revisão editorial pendente explicitada.

---

## Instrução de execução para o Codex

> Leia este checklist e os documentos existentes do repositório. **Primeiro faça auditoria**, depois implemente **fase por fase**, preservando o funcionamento atual. Não considere concluído o que depende de fotografia, licença, fonte ou teste não obtido. Faça commits/PRs pequenos e verificáveis, atualize as caixas marcadas e, ao final de cada fase, informe arquivos alterados, testes executados e pendências. **Não invente conteúdo, mapas, URLs, citações ou fontes.** Não implante em produção sem autorização explícita.

### Fontes iniciais úteis para a curadoria (não substituir por leitura superficial)

- [IBGE — Divisões Regionais do Brasil](https://www.ibge.gov.br/geociencias/cartas-e-mapas/redes-geograficas/15778-divisoes-regionais-do-brasil.html) — consultar também bases cartográficas e delimitação oficial do semiárido.
- [Programa Cisternas — MDS](https://www.gov.br/mds/pt-br/acoes-e-programas/acesso-a-alimentos-e-a-agua/programa-cisternas/saiba-mais).
- [Iphan — Lugares Sagrados de Juazeiro do Norte](https://www.gov.br/iphan/pt-br/assuntos/noticias/iphan-aprova-registro-dos-lugares-sagrados-de-juazeiro-do-norte-ce).
- [CNBB — Padre Cícero e devoções marianas](https://www.cnbb.org.br/vaticano-reconhece-virtudes-de-padre-cicero/).
- [*Calango Lengo — Morte e Vida sem Ver Água* no YouTube](https://www.youtube.com/watch?v=hj1fyV3pvSM) — checar titularidade do vídeo e disponibilidade antes de adicionar à interface.


### Pedidos complementares — display, mapas e celular

- [x] Destacar as quatro sub-regiões com cores evidentes, legenda numerada e seleção por toque/teclado; conferir a correspondência de Agreste e Zona da Mata com o desenho-fonte.
- [x] Selecionar estados diretamente no mapa e nos botões, com preenchimento amarelo, contorno, nome/sigla e ampliação do Nordeste.
- [x] Home com quatro colunas e duas linhas em1920×1080 e1366×768: oito cards visíveis na primeira tela; responsividade móvel preservada.
- [x] QR global Ver no celular, imagem local disponível offline, endereço público explícito e aviso de conexão no celular; fechamento conserva a visita.

Evidências: CI38985823025,29/29E2E e56unitários; capturas Home1920/1366/390, sub-regiões e QR revisadas. Ajuste final do enquadramento da Bahia aprovado na CI38986103221 (29/29E2E,56unitários), com captura revisada sem corte. Não substitui ensaio no display escolar nem revisão pedagógica.

Publicação desta atualização: https://flic2026-sertao-guxtavopereira.vercel.app/ — deployment dpl_3yiTQgBjVRYH8c6E1gqMjJp88Ze1, commit495a934d; Vercel também aprovou29/29E2E antes de reassociar o endereço público. Pacote offline sincronizado com o mesmo build.

Entrega conferida: acesso público sem login e assets iguais ao build aprovado; ZIP com113arquivos do app e133checksums verificados. Ensaio no Windows/display real permanece aberto na fase10.

Correção de aceite: a rota dedicada tinha quatro cores, mas a transição clima-09→clima-10 conservava o modo Brasil. Ajustada a identidade do componente por post; novo E2E do carrossel offline em validação. Não confundir a verificação da rota isolada com a navegação entre posts.
