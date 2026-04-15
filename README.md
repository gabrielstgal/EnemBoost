# 🚀 EnemBoost

**EnemBoost** é uma plataforma full-stack moderna projetada para auxiliar estudantes na preparação para o ENEM. A aplicação oferece ferramentas para gestão de estudos, simulados, acompanhamento de desempenho e acesso a conteúdos didáticos.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19**: Biblioteca para construção da interface.
- **Vite**: Build tool extremamente rápida.
- **React Router DOM**: Gerenciamento de rotas.
- **Phosphor Icons**: Conjunto de ícones consistentes e elegantes.

### Backend
- **Node.js & Express**: Ambiente de execução e framework web.
- **GraphQL (Apollo Server)**: API flexível e poderosa.
- **REST API**: Endpoints tradicionais para funcionalidades específicas (Uploads, Auth).
- **MongoDB & Mongoose**: Banco de dados NoSQL e modelagem de dados.
- **JWT (JSON Web Token)**: Autenticação segura.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação Segura**: Registro e login de usuários com senhas criptografadas (Bcrypt) e sessões via JWT.
- 📊 **Dashboard de Desempenho**: Visualize suas estatísticas, progresso e áreas que precisam de mais atenção.
- 📝 **Simulados e Questões**: Realize exames e pratique com questões categorizadas.
- 📚 **Gestão de Conteúdos**: Acesso organizado a materiais de estudo.
- 📁 **Upload de Arquivos**: Suporte para envio de arquivos e mídias.

---

## 📂 Estrutura do Projeto

```text
projetoEnem/
├── frontend/             # Código fonte do frontend (React + Vite)
├── src/                  # Código fonte do backend (Node.js)
│   ├── config/           # Configurações (DB, etc.)
│   ├── controllers/      # Lógica de controle das rotas REST
│   ├── graphql/          # Schemas (typeDefs) e Resolvers do GraphQL
│   ├── middlewares/      # Middlewares do Express (Auth, etc.)
│   ├── models/           # Modelos de dados (Mongoose)
│   ├── routes/           # Definição das rotas REST
│   └── scripts/          # Scripts utilitários
├── uploads/              # Arquivos estáticos enviados pelos usuários
├── server.js             # Arquivo principal de entrada do servidor
└── package.json          # Dependências e scripts do projeto
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js instalado.
- MongoDB rodando localmente ou uma URI do MongoDB Atlas.

### 1. Instruções de Instalação

Abra o terminal na raiz do projeto e execute:

```bash
# Instala as dependências tanto do servidor quanto do frontend
npm run install:all
```

### 2. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
PORT=5000
MONGODB_URI=sua_uri_do_mongodb_aqui
JWT_SECRET=uma_chave_secreta_muito_segura
FRONTEND_URL=http://localhost:5173
```

### 3. Rodando a Aplicação

Para iniciar o servidor e o frontend simultaneamente em modo de desenvolvimento:

```bash
npm run dev:all
```

- **Frontend**: Disponível em `http://localhost:5173` (ou a porta indicada pelo Vite)
- **Backend REST API**: `http://localhost:5000/api`
- **GraphQL Playground**: `http://localhost:5000/graphql`

---



---


