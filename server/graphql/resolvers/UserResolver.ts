import 'reflect-metadata';
import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql';
import argon2 from 'argon2';
import pino from 'pino';
import { User, UserResponse } from '../types/User';
import { Context } from '../../context';
import { UsernamePasswordInput } from '../inputs/UsernamePasswordInput';

const logger = pino();

@Resolver(User)
export class UserResolver {
  @Query((returns) => User, { nullable: true })
  async user(@Arg('id') id: number, @Ctx() ctx: Context) {
    return ctx.prisma.user.findUnique({ where: { id } });
  }

  @Query((returns) => [User], { nullable: true, description: 'Return a list of all users' })
  async allUsers(@Ctx() ctx: Context) {
    return ctx.prisma.user.findMany();
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
      console.log(error);
      return { errors: [{ field: 'Unknown', message: 'Unexpected error' }] };
    }
  }
}
