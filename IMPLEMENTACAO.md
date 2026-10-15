# Ariano Suassuna e o Sertão — FLIC 2026

Museu interativo com seis temas, 30 slides, 18 questões, estações literárias, linha do tempo e ciclo da Caatinga. Tema claro, fontes locais e navegação por toque, clique e teclado. Sem login, API, analytics ou banco obrigatório.

## Executar

Node.js 22 ou 24. Instale com `npm install`, depois `npm run dev`.

- `npm run lint`: ESLint e regras de hooks.
- `npm test`: contratos, quiz, navegação e publicação literária.
- `npm run build`: TypeScript strict, Vite e precache PWA em `dist/`.
- `npx playwright install chromium` e `npm run test:e2e`: percursos completos, toque, teclado, direitos, responsividade, acessibilidade e rede desligada.
- `npm run preview`: servir o build local.

Na Vercel, os testes usam Chromium serverless, sem instalar navegador no computador do visitante. O preset é Vite e o diretório de saída é `dist`.

## Offline

Abra via HTTPS ou localhost com rede e aguarde “Pronto para usar offline”. A aplicação precacheia fontes, imagens e código. As atualizações exigem uma ação na Home para não interromper quizzes. Apagar o cache exige novo preparo online. Não use `file://`.

## Conteúdo e direitos

`src/content/modules.json` preserva os textos fornecidos. A normalização aceita os aliases de temas presentes na documentação. O JSON literário usado no frontend contém apenas contexto e comentários; transcrições pendentes são excluídas do bundle. Os cinco painéis usam paráfrases identificadas. Citações só são renderizadas com aprovação explícita, edição, página, autorização, fonte e revisão editorial.

As seis xilogravuras foram fornecidas como arte gerada por IA. Atribuições, licenças, dados históricos e fontes ambientais, culinárias e de personalidades aguardam revisão pela curadoria antes da exposição. Nenhum texto pendente é apresentado como fala do autor.

## Operação

Use as opções de exibição para tela cheia, redução de movimento e retorno à entrada por inatividade (3, 5 ou 10 minutos, com aviso de 30 segundos). Reiniciar visita limpa progresso e resultados anônimos da sessão. O botão Início mantém pontuações durante a visita.

Antes da feira: ensaiar com o monitor touch definitivo, distância de leitura, iluminação, acesso sem rede e sessão prolongada. Não considerar testes automatizados equivalentes à validação presencial.
## Ranking local — atualização

No resultado de qualquer quiz ou na Home após responder perguntas, escolha **Encerrar visita e ver ranking**. O resumo reúne os acertos das perguntas únicas respondidas na visita, em até 18 questões. Refazer substitui as respostas desse tema. A participação é opcional, com primeiro nome ou apelido e escolha explícita de exibição. O registro é único por visita; novas submissões não duplicam a pontuação.

O ranking salva até 1000 visitas recentes no localStorage deste navegador, funciona offline e continua ao iniciar a próxima visita. Não é compartilhado entre dispositivos; apagar os dados do navegador o remove. Nas opções de exibição há uma ação de limpeza com confirmação para a organização. Falhas ou bloqueio de armazenamento são mostrados sem impedir o museu.
