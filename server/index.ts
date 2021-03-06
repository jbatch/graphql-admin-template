import 'reflect-metadata';
import * as tq from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';
import { createContext } from './context';
import { UserResolver } from './graphql/resolvers/UserResolver';

const prisma = new PrismaClient();

async function main() {
  const schema = await tq.buildSchema({
    resolvers: [UserResolver],
  });

  const context = createContext();
  const apollo = new ApolloServer({ schema, context: createContext }).listen({ port: 4000 }, () =>
    console.log(`🚀 Apollo Server ready at: http://localhost:4000`)
  );
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
