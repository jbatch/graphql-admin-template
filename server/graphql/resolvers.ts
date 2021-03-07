import { Context } from './context';
import { MutationResolvers, QueryResolvers, UserResolvers } from './graphql';
import { IResolvers } from 'graphql-tools';
import { Errors } from '@repo/shared/Errors';
import pino from 'pino';
import argon2 from 'argon2';

interface Resolvers {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  User: UserResolvers;
}

const logger = pino();

export const resolvers: Resolvers & IResolvers = {
  Query: {
    me: async (root, args, ctx, info) => {
      const userId = ctx.req.session.userId;
      if (!userId) {
        return unauthenticatedError();
      }
      const user = await ctx.prisma.user.findUnique({ where: { id: Number(userId) } });
      return { user };
    },
    allUsers: async (root, args, ctx, info) => {
      const users = await ctx.prisma.user.findMany();
      logger.info('allUsers(): Returning %s users', users.length);
      return users;
    },
    user: async (root, args, ctx, info) => {
      return ctx.prisma.user.findUnique({ where: { id: args.id } });
    },
  },
  Mutation: {
    login: async (root, args, ctx, info) => {
      try {
        const maybeUser = await ctx.prisma.user.findUnique({
          where: { username: args.username },
        });
        // Check user exists
        if (maybeUser === null) {
          return failedLogin(args.username);
        }

        // Check password correct
        const passwordsMatch = await argon2.verify(maybeUser.password, args.password);
        logger.info('Passwords match %o', { passwordsMatch });
        if (!passwordsMatch) {
          return failedLogin(args.username);
        }

        ctx.req.session.userId = String(maybeUser.id);
        logger.info(`User ${args.username} logged in`);
        return { user: maybeUser };
      } catch (error: any) {
        return unexpectedError(error);
      }
    },
    register: async (root, args, ctx, info) => {
      // TODO validate input
      const hashedPassword = await argon2.hash(args.password);
      try {
        let user = await ctx.prisma.user.create({ data: { username: args.username, password: hashedPassword } });
        // Give user the USER role by default.
        await ctx.prisma.role.create({ data: { userId: user.id, name: 'USER' } });
        logger.info('Created new user: %s', user.username);
        return { user };
      } catch (error: any) {
        const { message } = error;
        if (message.includes('Unique constraint failed on the constraint') && message.includes('username_unique')) {
          return userAlreadyExists();
        }
        return unexpectedError(error);
      }
    },
  },
  User: {
    roles: async (user, args, ctx, info) => {
      const roles = await ctx.prisma.role.findMany({ where: { userId: user.id } });
      return roles.map((r) => r.name);
    },
  },
};

const unauthenticatedError = () => {
  return { errors: [{ message: Errors.NOT_AUTHENTICATED }] };
};

const failedLogin = (username: string) => {
  logger.info(`Failed login for user ${username}`);
  return { errors: [{ field: 'username', message: `User not found or password incorrect` }] };
};

const userAlreadyExists = () => {
  return { errors: [{ field: 'username', message: `User already exists with username` }] };
};

const unexpectedError = (error: any) => {
  logger.error(error);
  return { errors: [{ message: `Unexpected error: ${JSON.stringify(error)}` }] };
};
