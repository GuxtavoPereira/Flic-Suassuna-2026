# Imagens fornecidas — lotes 1 e 2

Recebidas em 16/10/2026 e conferidas visualmente. Cada arte mantém o arquivo WebP original, sem recorte. O manifesto original declara geração por IA. As legendas deixam claro que não são fotografias documentais, capas oficiais, reproduções históricas nem cenas verificadas de montagens.

## Aplicadas

- Lote 1: `clima-01` a `clima-05`, `ariano-02` a `ariano-05`.
- Lote 2: `cultura-01` a `cultura-05`.
- Total: 14 artes, associadas pelo `postId` em `src/content/supplied-assets.json`.
- Os painéis Auto da Compadecida, O Santo e a Porca, Pedra do Reino e Armorial usam a arte correspondente como imagem principal. O registro real anteriormente usado continua em **Registro documental de contexto**, com crédito e licença originais.
- Cards da Home, fotografias de personalidades e posts sem novas artes permanecem como estavam.
- Nenhum texto cultural, pergunta, pontuação, nome ou resultado do ranking foi alterado.

## Pendente

- `ariano-04-alternativa.webp` fica reservada no ZIP original. O manifesto a identifica como alternativa de `ariano-04`; sua cena não será remapeada para outra obra apenas por suposição.
- Lote 3 ainda não fornecido nesta atualização.
- Autoria/ferramenta e licença geral das artes não são informadas nos pacotes; não se atribui licença livre ou crédito documental inventado.

## Próximos lotes

Adicione o WebP local e um registro no catálogo com `postId` (e `panelId`, quando aplicável), alt, legenda e procedência. A normalização associa a imagem sem mudar o pool ou a sessão. Todas as artes e manifestos entram no precache e no pacote offline.

## Validação

Lint, tipos, build, 47 testes unitários, teste do servidor local e 21 E2E aprovados. Os testes incluem a correspondência das artes aos posts e painéis, documentação preservada, decodificação de todas as imagens offline, acessibilidade e diferentes resoluções. O ensaio no display Windows da escola continua pendente.
