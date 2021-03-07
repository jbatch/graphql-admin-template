import 'reflect-metadata';
import 'dotenv-safe/config';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import express, { Request, Response } from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import { join } from 'path';

import { __prod__, COOKIE_NAME } from './constants';
import { createContext } from './graphql/context';
import { resolvers } from './graphql/resolvers';

const prisma = new PrismaClient();

async function main() {
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL, { password: process.env.REDIS_PASSWORD });

  // Setup session management
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const schema = loadSchemaSync(join(__dirname, 'graphql', 'schema.graphql'), { loaders: [new GraphQLFileLoader()] });
  const schemaWithResolvers = addResolversToSchema({
    schema,
    resolvers,
  });

  const apollo = new ApolloServer({
    schema: schemaWithResolvers,
    context: ({ req, res }: { req: Request; res: Response }) => createContext(req, res),
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
  });
  apollo.applyMiddleware({ app });
  app.listen({ port: 4000 }, () => console.log(`🚀 Apollo Server ready at: http://localhost:4000`));
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
