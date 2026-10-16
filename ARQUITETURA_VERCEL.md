# Arquitetura e publicação

Um projeto Vercel existente: `flic2026-sertao`. SPA React19/TypeScript/Vite, React Router, Zod e vite-plugin-pwa. Sem backend/banco obrigatório. Dados editoriais compilados do JSON; imagens/fontes locais; geometrias oficiais separadas em chunk cartográfico. Service worker gera precache, fallback de rotas e atualização por escolha na Home.

Estado: SessionProvider, sessão versionada, histórico e repositório de ranking local. Módulos novos não modificam o total competitivo. Camadas principais: src/content (validação/normalização), domain (seleção/quiz/direitos/resumo), services (persistência), components (mapas/cisterna/vídeo/imagens/ranking) e App (rotas/telas).

`vercel.json` conserva rewrites da SPA e exceções para assets, imagens, ícones, fontes de revisão, SW e manifesto. Header do SW impede cache HTTP indevido. A branch atual exige ambiente Preview antes de build/testes; produção deve falhar. Preview isolado está sujeito à autorização operacional da integração. O alias público anterior não deve ser reassociado nesta entrega.

A CI GitHub do PR roda lint/tipos/validação/unitários/servidor/build/E2E e guarda evidências sem deploy. O Chromium de teste vem da dependência do projeto; nada é instalado no PC do visitante.

O pacote portátil usa o mesmo dist e o servidor offline/servidor.mjs, HTTP local em127.0.0.1:4173, GET/HEAD, MIME e fallback de SPA. Runtime Node oficial Windowsx64, hash fixado no empacotador e licenças anexas. Sem serviços de rede ou privilégios administrativos.
