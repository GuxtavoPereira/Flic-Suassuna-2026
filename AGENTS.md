# Manutenção da exposição FLIC 2026

Preservar o projeto existente React/TypeScript/Vite, um único projeto Vercel, tema claro, toque/teclado e conteúdo local. Não introduzir banco, login ou dependência de rede para a visita.

Ler README, AUDITORIA-EVOLUCAO, TELAS_E_UX, MODELO-CONTEUDO, LITERATURA_E_DIREITOS e CHECKLIST-EVOLUCAO antes de alterar. O código e seus testes são a referência de funcionamento; documentar divergências.

IDs/aliases existentes e ranking local precisam ser preservados. `modules.json` é referência original; o pool ativo é `pools.json`. Quantidades por sessão e habilitação de quiz vêm de `experience-settings.json`. Seis temas têm `rankingEligible`; vídeo/quantidade de posts não podem aumentar pontos. Alterações de perguntas já respondidas exigem novos IDs e revisão da migração.

Não inventar fotografias, fronteiras, datas, URLs, atribuições ou permissões. Manter fontes e licenças por imagem; identificar registros de contexto. Arte sintética não representa fato histórico. Nenhuma citação literária pendente pode aparecer como transcrição liberada.

Validar lint, tipos, conteúdo, unitários, servidor offline, build e E2E apropriados. Reconstruir dist quando mudarem imagens/fontes antes dos testes de precache. Testes automatizados não comprovam leitura no display físico ou aprovação pedagógica.

O proprietário autorizou explicitamente a publicação desta evolução em produção em 16/10/2026. `require-deployment-target.mjs` aceita apenas Preview ou Production e rejeita destino ausente/desconhecido. Futuras publicações devem respeitar a autorização da sessão. Atualizar checklist apenas após evidência; registrar pendências reais.
