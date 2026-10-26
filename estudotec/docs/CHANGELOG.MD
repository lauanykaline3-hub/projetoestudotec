# Changelog

## 2026-10-26
- Criada interface de estudos responsiva com matérias, assuntos, resumos e questões.
- Adicionados busca, feedback de resposta e persistência do progresso no navegador.
- Mantidos Gmail e senha no acesso, com validação Zod, React Hook Form e mensagens em português.
- Removida a implementação de autenticação do servidor e SQLite para atender ao requisito de frontend-only.
- Adicionado cadastro local. O JSON `src/data/usuarios.json` é uma lista seed vazia; contas criadas são guardadas no `localStorage`.
- Derivação de senha feita com PBKDF2/SHA-256 e salt aleatório; a senha original não é persistida.
- O botão Sair limpa a sessão e o progresso, preservando o cadastro local para novo login.
- Documentado que autenticação somente no frontend é demonstrativa, pode ser alterada no navegador e não confirma a posse do Gmail.
- Migradas as declarações CSS para utilitários Tailwind via `@apply`, preservando os seletores e breakpoints existentes.
- Removidos `better-sqlite3`, seus tipos e as rotas de autenticação do App Router.
- Corrigida a codificação das mensagens do schema de login.
- TypeScript, lint e teste local do fluxo concluídos; `npm audit` reporta zero vulnerabilidades.
- Adicionados quatro usuários fictícios de demonstração ao JSON seed; senhas correspondentes documentadas no README e não armazenadas em texto no JSON.
