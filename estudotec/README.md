# Estudo Tec

Aplicação de apoio aos estudos criada com Next.js, TypeScript e Tailwind CSS (100% frontend).

## Executar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Navegação por Páginas (Next.js App Router) e Animações

A aplicação não utiliza âncoras fictícias:
- Rotas reais: `/` (início), `/equipes` (equipe) e `/materias/[slug]` (rotas dinâmicas por matéria).
- Animação suave e fluida a cada troca de página viabilizada pelo [template.tsx](src/app/template.tsx) e regras de animação em [globals.css](src/app/globals.css).

## Segurança e Criptografia no LocalStorage

Todos os dados gravados no navegador são automaticamente criptografados via [storage-crypto.ts](src/lib/storage-crypto.ts):
- Usuários, senhas, sessões ativas e progresso de estudos são salvos sob cifras criptográficas seguras, impedindo a visualização em texto puro pelo DevTools/inspeção do navegador.
- O botão **Sair da conta** realiza a limpeza total do `localStorage` (`localStorage.clear()`), garantindo que nenhuma informação pessoal ou de sessão permaneça no computador após o logout.

## Tema Dark / Light (Modo Escuro e Claro)

A aplicação conta com suporte completo a alternância de temas:
- **Botão de Alternância (`ThemeToggle`)**: Posicionado na tela inicial e na barra de navegação superior (topbar), aplicando o tema automaticamente em toda a aplicação (incluindo a página `/equipes`).
- **Persistência Local**: A escolha do usuário é gravada no `localStorage` sob a chave `estudotec-tema` e sincronizada instantaneamente.
- **Detecção do Sistema**: Caso não haja preferência salva, o sistema detecta automaticamente o esquema de cores preferido do sistema operacional (`prefers-color-scheme`).

## Perfis de Acesso e Painel de Controle

A aplicação possui dois perfis de acesso locais:

1. **👑 Administrador (`admin`)**:
   - Tem acesso irrestrito a todas as matérias e estudos.
   - Acesso exclusivo ao **🎛️ Painel de Controle** no topo da página com **CRUD Completo**:
     - **📋 Visão Geral & Lista Completa**: Busca dinâmica e visualização em árvore de tudo o que existe no sistema, com ações rápidas de edição e exclusão.
     - **📚 Matérias (CRUD)**: Criar, visualizar, editar (nome, ícone, cor) e excluir matérias.
     - **📝 Assuntos (CRUD)**: Criar, filtrar por matéria, editar (título, descrição, resumos) e excluir tópicos teóricos.
     - **🎯 Atividades (CRUD)**: Criar, listar com gabarito, editar (enunciado, alternativas, resposta, explicação) e excluir questões.
     - **👥 Usuários (CRUD)**: Criar novas contas, visualizar senhas legíveis, editar senha/papel (Admin ↔ Estudante) e remover usuários (com proteção de auto-exclusão).
     - **✨ Criar Tudo Junto**: Fluxo ágil para criar matéria + assunto + atividade em uma única etapa.
2. **🎓 Estudante / Usuário (`usuario`)**:
   - Acesso focado no aprendizado.
   - Navega pelas matérias e assuntos (incluindo as recém-criadas ou alteradas pelo Administrador).
   - Lê resumos explicativos, responde questões interativas com feedback imediato e acompanha seu progresso em tempo real.
   - O botão e as opções do Painel de Controle ficam estritamente ocultos para o estudante.

## Contas de demonstração

As contas estão cadastradas diretamente em `src/data/usuarios.json`:

| Nome | Perfil | Gmail de demonstração | Senha de demonstração |
| --- | --- | --- | --- |
| **Ana Clara** | 👑 Administrador | `ana.clara.demo2026@gmail.com` | `EstudoTec#Ana2026` |
| **Bruno Miguel** | 🎓 Estudante | `bruno.miguel.demo2026@gmail.com` | `EstudoTec#Bruno2026` |
| **Camila Souza** | 🎓 Estudante | `camila.souza.demo2026@gmail.com` | `EstudoTec#Camila2026` |
| **Diego Santos** | 🎓 Estudante | `diego.santos.demo2026@gmail.com` | `EstudoTec#Diego2026` |

## Equipe do Projeto

Na página `/equipes`, é possível conhecer as participantes do projeto com foto individual (armazenada em `public/fotoEquipe/`) e sistema automático de fallback para as iniciais coloridas caso alguma imagem falhe ao carregar.
