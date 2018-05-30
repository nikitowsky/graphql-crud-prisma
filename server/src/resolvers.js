const resolvers = {
  Query: {
    todo: (_, args, context) => {
      return context.prisma.query.todo({
        where: { id: args.id },
      });
    },
    todoes: (_, args, context) => {
      return context.prisma.query.todoes({
        where: {
          OR: [{ title_contains: args.searchString }, { description_contains: args.searchString }],
        },
      });
    },
  },
  Mutation: {
    createTodo: (_, args, context) => {
      return context.prisma.mutation.createTodo({
        data: {
          title: args.title,
          description: args.description,
          complete: false,
        },
      });
    },
    updateTodo: (_, args, context) => {
      return context.prisma.mutation.updateTodo({
        where: { id: args.id },
        data: { complete: args.complete },
      });
    },
    deleteTodo: (_, args, context) => {
      return context.prisma.mutation.deleteTodo({
        where: { id: args.id },
      });
    },
  },
};

module.exports = resolvers;
