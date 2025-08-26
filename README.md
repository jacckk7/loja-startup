# Loja Startup

## Como rodar o projeto do zero

### 1. Configuração do ambiente

- **Clone o repositório**:
  ```bash
  git clone https://github.com/jacckk7/loja-startup.git
  cd loja-startup
  ```

- **Crie o arquivo `.env`**:
  Copie o exemplo:
  ```bash
  cp .env.example .env
  ```
  Edite o arquivo `.env` e configure a variável `DATABASE_URI` com a URI do seu MongoDB, por exemplo:
  ```
  DATABASE_URI=mongodb://127.0.0.1/loja-db
  PAYLOAD_SECRET=uma_senha_segura
  ```

- **Instale os módulos do Node**:
  ```bash
  pnpm install
  ```
  ou
  ```bash
  npm install
  ```

- **Rode o projeto**:
  ```bash
  pnpm dev
  ```
  ou
  ```bash
  npm run dev
  ```
  Acesse `http://localhost:3000` no navegador.

### 2. Criando um usuário admin

- Ao acessar a aplicação pela primeira vez, será exibida a tela de login/cadastro.
- Crie o primeiro usuário pelo painel de administração, preenchendo os campos obrigatórios.
- O primeiro usuário criado será o admin e terá acesso total ao painel.

---

## Explicação detalhada das collections

### Produtos

Arquivo: [`src/collections/Produtos.ts`](src/collections/Produtos.ts)

**Campos:**
- `nome` (string, obrigatório): Nome do produto.
- `descricao` (string, opcional): Descrição detalhada.
- `preco` (number, obrigatório): Preço do produto.
- `estoque` (number, obrigatório, default: 0): Quantidade disponível em estoque.

**Hooks:**  
Não há hooks customizados na collection Produtos.

**Exemplo de documento:**
```json
{
  "id": "abc123",
  "nome": "Camiseta",
  "descricao": "Camiseta 100% algodão",
  "preco": 49.90,
  "estoque": 10,
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Rotas CRUD:**
- **GET** `/api/produtos` — Lista todos os produtos.
- **GET** `/api/produtos/:id` — Busca um produto pelo ID.
- **POST** `/api/produtos` — Cria um novo produto.
- **PUT/PATCH** `/api/produtos/:id` — Atualiza um produto.
- **DELETE** `/api/produtos/:id` — Remove um produto.

---

### Transações

Arquivo: [`src/collections/Transacoes.ts`](src/collections/Transacoes.ts)

**Campos:**
- `produto` (relationship, obrigatório): Referência ao produto vendido.
- `quantidade` (number, obrigatório, default: 1): Quantidade vendida.
- `data` (date, obrigatório, default: data atual): Data da transação.

**Hooks:**
- **beforeChange**:  
  - Ao criar uma transação, verifica se há estoque suficiente do produto. Se não houver, lança erro.
  - Ao atualizar, verifica se o aumento de quantidade não excede o estoque disponível.
- **afterChange**:  
  - Ao criar, diminui o estoque do produto conforme a quantidade vendida.
  - Ao atualizar, ajusta o estoque conforme a diferença entre a quantidade antiga e a nova.
- **afterDelete**:  
  - Ao deletar uma transação, devolve o estoque do produto referente à quantidade removida.

**Exemplo de documento:**
```json
{
  "id": "trans123",
  "produto": "abc123",
  "quantidade": 2,
  "data": "2025-08-26T12:00:00.000Z",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Rotas CRUD:**
- **GET** `/api/transacoes` — Lista todas as transações.
- **GET** `/api/transacoes/:id` — Busca uma transação pelo ID.
- **POST** `/api/transacoes` — Cria uma nova transação (verifica estoque).
- **PUT/PATCH** `/api/transacoes/:id` — Atualiza uma transação (ajusta estoque).
- **DELETE** `/api/transacoes/:id` — Remove uma transação (devolve estoque).

---

## Observações

- Todas as rotas REST seguem o padrão `/api/[collection]`.
- O projeto também suporta GraphQL em `/api/graphql`.
- O painel admin está disponível em `/admin`.
