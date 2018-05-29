# GraphQL create/read/update/delete todo app example

## React, Apollo, Prisma (PostgreSQL)

---

How to run app:

```zsh
git clone https://github.com/borisowsky/graphql-crud-prisma.git
cd graphql-crud-prisma

# Client
cd client
yarn # To install all dependencies
yarn start # To run React app

# Server
cd ../prisma
yarn global add prisma
docker-compose up -d
prisma deploy # To run server
```
