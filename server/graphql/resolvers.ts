import argon2 from 'argon2';
import { IResolvers } from 'graphql-tools';
import pino from 'pino';

import { MutationResolvers, QueryResolvers, UserResolvers } from './graphql';
import { Errors } from '../errors';
import { userService } from '../models/user';

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
      const user = await userService.findUserById(Number(userId));
      return { user };
    },
    allUsers: async (root, args, ctx, info) => {
      const users = await userService.findAllUsers();
      logger.info('allUsers(): Returning %s users', users.length);
      return users;
    },
    user: async (root, args, ctx, info) => {
      return await userService.findUserById(args.id);
    },
  },
  Mutation: {
    login: async (root, args, ctx, info) => {
      return userService.login(args.username, args.username, ctx.req.session);
    },
    register: async (root, args, ctx, info) => {
      return userService.register(args.username, args.password);
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
