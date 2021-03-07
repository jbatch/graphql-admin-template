import 'reflect-metadata';
import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql';
import argon2 from 'argon2';
import pino from 'pino';
import { User, UserResponse } from '../types/User';
import { Context } from '../context';
import { UsernamePasswordInput } from '../inputs/UsernamePasswordInput';
import { LoginInput } from '../inputs/LoginInput';

const logger = pino();

@Resolver(User)
export class UserResolver {
  @Query((returns) => UserResponse, { nullable: true })
  async me(@Ctx() ctx: Context): Promise<UserResponse> {
    const userId = ctx.req.session.userId;
    if (!userId) {
      return unauthenticatedError();
    }
    const user = await ctx.prisma.user.findUnique({ where: { id: Number(userId) } });
    return { user };
  }

  @Query((returns) => User, { nullable: true })
  async user(@Arg('id') id: number, @Ctx() ctx: Context) {
    return ctx.prisma.user.findUnique({ where: { id } });
  }

  @Query((returns) => [User], { nullable: true, description: 'Return a list of all users' })
  async allUsers(@Ctx() ctx: Context) {
    const users = await ctx.prisma.user.findMany();
    logger.info('allUsers(): Returning %s users', users.length);
    return users;
  }

  @Mutation(() => UserResponse)
  async register(@Arg('options') options: UsernamePasswordInput, @Ctx() ctx: Context): Promise<UserResponse> {
    // TODO validate input
    const hashedPassword = await argon2.hash(options.password);
    try {
      const user = await ctx.prisma.user.create({ data: { username: options.username, password: hashedPassword } });
      logger.info('Created new user: %s', user.username);
      return { user };
    } catch (error: any) {
      const { message } = error;
      if (message.includes('Unique constraint failed on the constraint') && message.includes('username_unique')) {
        return userAlreadyExists(options.username);
      }
      return unexpectedError(error);
    }
  }

  @Mutation(() => UserResponse)
  async login(@Arg('options') options: LoginInput, @Ctx() ctx: Context): Promise<UserResponse> {
    try {
      const maybeUser = await ctx.prisma.user.findUnique({ where: { username: options.username } });
      // Check user exists
      if (maybeUser === null) {
        return failedLogin(options.username);
      }

      // Check password correct
      const passwordsMatch = await argon2.verify(maybeUser.password, options.password);
      logger.info('Passwords match %o', { passwordsMatch });
      if (!passwordsMatch) {
        return failedLogin(options.username);
      }

      ctx.req.session.userId = String(maybeUser.id);
      logger.info(`User ${options.username} logged in`);
      return { user: maybeUser };
    } catch (error: any) {
      return unexpectedError(error);
    }
  }
}

const unauthenticatedError = () => {
  return { errors: [{ message: `Not authenticated` }] };
};

const failedLogin = (username: string) => {
  logger.info(`Failed login for user ${username}`);
  return { errors: [{ field: 'username', message: `User not found or password incorrect` }] };
};

const userAlreadyExists = (username: string) => {
  return { errors: [{ field: 'username', message: `User already exists with username ${username}` }] };
};

const unexpectedError = (error: any) => {
  logger.error(error);
  return { errors: [{ message: `Unexpected error: ${JSON.stringify(error)}` }] };
};
