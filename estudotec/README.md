# Estudo Tec

Aplicação de apoio aos estudos criada com Next.js, TypeScript e Tailwind CSS.

## Executar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Cadastro e login locais

Escolha **Cadastre-se** para criar uma conta com endereço terminado em `@gmail.com` e senha de pelo menos 8 caracteres. O cadastro fica neste navegador. Depois, use o mesmo Gmail e senha para entrar.

`src/data/usuarios.json` contém quatro contas fictícias de demonstração. Novos cadastros são gravados no `localStorage`; a senha é derivada com PBKDF2/SHA-256 e salt aleatório, sem persistir o texto original.

### Contas fictícias para demonstração

Estas contas são dados de teste do projeto, não caixas de Gmail verificadas. As senhas aparecem aqui apenas para permitir testar o login; não use esses dados como credenciais reais.

| Estudante | Gmail de demonstração | Senha de demonstração |
| --- | --- | --- |
| Ana Clara | `ana.clara.demo2026@gmail.com` | `EstudoTec#Ana2026` |
| Bruno Miguel | `bruno.miguel.demo2026@gmail.com` | `EstudoTec#Bruno2026` |
| Camila Souza | `camila.souza.demo2026@gmail.com` | `EstudoTec#Camila2026` |
| Diego Santos | `diego.santos.demo2026@gmail.com` | `EstudoTec#Diego2026` |

O botão **Sair da conta** remove sessão e progresso, mas mantém a conta cadastrada para permitir novo login.

Este login é demonstrativo e frontend-only. Dados locais podem ser inspecionados ou alterados pelo usuário, e a aplicação não verifica se ele controla o Gmail. Não reutilize senhas importantes.
