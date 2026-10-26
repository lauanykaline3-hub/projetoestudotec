# Tarefas do Estudo Tec

## Aplicação
- [x] Navbar responsiva com a marca Estudo Tec e links de matérias.
- [x] Navegação por matéria, assunto, resumo e questões.
- [x] Busca, feedback de resposta e progresso de estudo.
- [x] Persistir seleção, respostas e progresso no navegador.
- [x] Login e cadastro no frontend com validação Zod.
- [x] Persistir contas locais com hash PBKDF2 e salt; não guardar senha em texto.
- [x] Encerrar sessão e limpar progresso no botão Sair, preservando contas para novo acesso.
- [x] Usar `src/data/usuarios.json` como seed com contas claramente identificadas como demonstração.
- [x] Adicionar quatro contas fictícias de demonstração com hashes PBKDF2 no JSON seed.
- [x] Remover API de autenticação e dependência de banco/driver no servidor.
- [x] Compor as regras de estilo com utilitários Tailwind `@apply`.

## Verificações
- [x] `npx tsc --noEmit`
- [x] `npm run lint`
- [x] `npm audit` sem vulnerabilidades reportadas.
- [x] Teste local de cadastro, duplicidade, senha válida/inválida e hash.
