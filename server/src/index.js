const { resolve } = require('path');
const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

const resolvers = require('./resolvers');

const options = { port: 4000 };
const context = (req) => ({
  ...req,
  prisma: new Prisma({
    typeDefs: resolve(__dirname, '../prisma/generated/prisma.graphql'),
    endpoint: 'http://localhost:4466',
  }),
});

const server = new GraphQLServer({
  typeDefs: resolve(__dirname, './typeDefs.graphql'),
  resolvers,
  context,
});

server.start(options, () => console.log(`Server is running on http://localhost:${options.port}`));
