# Now API

![Now API](https://img.shields.io/badge/Node.js-green)
![NestJS](https://img.shields.io/badge/NestJS-red)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![TypeScript](https://img.shields.io/badge/Prisma-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.0-blue)
![Docker](https://img.shields.io/badge/Docker-blue)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

## 📖 Sobre

A **Now API** é uma solução RESTful desenvolvida para gerenciar e monitorar atividades e processos organizacionais e pessoais de forma eficiente. Ela fornece endpoints para criar, atualizar, organizar e visualizar tarefas em um estilo Kanban.

Desenvolvida com **TypeScript**, **Node.js**, **NestJS** e utilizando **Prisma** como ORM, a API segue princípios de **SOLID** e utiliza **Design Patterns** para garantir escalabilidade, manutenção e robustez.

---

## 🚀 Tecnologias Utilizadas

- **Node.js**: Plataforma de execução JavaScript.
- **NestJS**: Framework para criação de aplicações escaláveis e estruturadas.
- **TypeScript**: Superset do JavaScript com tipagem estática.
- **Prisma (ORM)**: Abstração para modelagem e manipulação do banco de dados.
- **Docker**: Contêineres para facilitar a criação, execução e implantação da aplicação em qualquer ambiente.
- **PostgreSQL**: Banco de dados relacional.
- **Swagger**: Documentação interativa de APIs.
- **Postman**: Teste de endpoints.

---

## ⚙️ Funcionalidades

- **Gestão de áreas de trabalho**:
  - Criar, editar e excluir áreas de trabalho.
  - Organização da ordem para dar mais prioridades
  - **Gestão de Projetos**:
  - Criar, editar e excluir projetos.
  - Adição de novos membros para acessos personalizados
- **Gestão de tarefas**:
  - Criar, editar e excluir tarefas.
  - Atualizar status de tarefas (To Do, In Progress, Done).
- **Gestão de usuários**:
  - Registro e autenticação.
  - Autorização personalizada e protegida para recursos sensíveis.
  - Atribuição de tarefas.
- **Monitoramento de processos**:
  - Visualização de tarefas agrupadas por status.
  - Armazenamento de logs para facilitar monitoramento.
  - Histórico de alterações.

---

## 🛠️ Instalação e Configuração

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/kanban-api.git
   ```
2. Acesse o diretório do projeto:
   ```bash
   cd kanban-api
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Configure as variáveis de ambiente:
   Crie um arquivo `.env` ou `.env.test.local` na raiz do projeto com os seguintes parâmetros:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/kanban_db
   JWT_SECRET=sua-chave-secreta
   ```
5. Execute as migrations do Prisma:
   ```bash
   npx prisma migrate dev
   ```
6. Inicie o servidor:
   ```bash
   npm run start:dev
   ```

---

## 📚 Documentação da API

A documentação completa está disponível através do **Swagger**. Após iniciar o servidor, acesse:

```
http://localhost:8000/api
```

Lá você encontrará detalhes de cada endpoint, incluindo métodos, parâmetros e exemplos de resposta.

### Imagens do Swagger
![alt text](swagger1.PNG)
![alt text](swagger2.PNG)
![alt text](swagger3.PNG)
---

## 🧪 Testes

Para testar os endpoints, você pode usar o **Postman** ou qualquer cliente HTTP de sua preferência.

1. Configure o ambiente no Postman (se necessário).
2. Adicione as rotas de cada Controller.
3. Execute os testes e valide os endpoints.

OBS: Lembre de inserir o Bearer Token para determinadas rotas com permissão de membro ou admin

---

## 🧩 Estrutura do Projeto

A API segue uma arquitetura modular, promovendo organização e escalabilidade.

```bash
src
├── modules
│   ├── auth        # Módulo de autenticação
│   ├── board       # Módulo de boards
│   ├── history     # Módulo do histórico
│   ├── task        # Módulo de tarefas
│   ├── prisma      # Módulo do Prisma
│   ├── prisma      # Módulo de projeto
│   ├── task        # Módulo de tarefas
│   └── user        # Módulo de usuários
├── common          # Componentes compartilhados (filtros, interceptors, decorators, interfaces, etc.)
├── prisma          # Configuração e client do Prisma
├── app.module.ts   # Módulo principal da aplicação
└── main.ts         # Ponto de entrada da aplicação
```

---

## 📌 Princípios de Desenvolvimento

- **SOLID**: Garantindo código modular e extensível.
- **Design Patterns**: Utilização de padrões como Repository e Service.
- **Clean Code**: Código limpo, legível e de fácil manutenção.

---

## 🤝 Contribuições

Contribuições são bem-vindas! Siga os passos abaixo para colaborar:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature/bugfix:
   ```bash
   git checkout -b feature/nova-feature
   ```
3. Faça o commit das suas alterações:
   ```bash
   git commit -m "Descrição da feature"
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin feature/nova-feature
   ```
5. Abra um Pull Request.

---


## ✨ Contato

Matheus Rodrigues Araujo - [LinkedIn](https://www.linkedin.com/in/matheus-rodrigues-araujo/) | [GitHub](https://github.com/Matheus-Rodrigues-Araujo)

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 📄 Licença

Este projeto está licenciado sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

---