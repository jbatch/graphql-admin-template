import { IResolvers } from 'graphql-tools';
import pino from 'pino';

import { Errors } from '../errors';
import { users } from '../models/users';
import { roles } from '../models/roles';
import { MutationResolvers, QueryResolvers, UserResolvers } from './graphql';

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
      const user = await users.findUserById(Number(userId));
      return { user };
    },
    allUsers: async (root, args, ctx, info) => {
      const allUsers = await users.findAllUsers();
      logger.info('allUsers(): Returning %s users', allUsers.length);
      return allUsers;
    },
    user: async (root, args, ctx, info) => {
      return await users.findUserById(args.id);
    },
  },
  Mutation: {
    login: async (root, args, ctx, info) => {
      return users.login(args.username, args.username, ctx.req.session);
    },
    register: async (root, args, ctx, info) => {
      return users.register(args.username, args.password);
    },
  },
  User: {
    roles: async (user, args, ctx, info) => {
      return roles.findRolesForUser(user.id);
    },
  },
};

const unauthenticatedError = () => {
  return { errors: [{ message: Errors.NOT_AUTHENTICATED }] };
};
