import { PrismaClient, User } from '@prisma/client';
import pino from 'pino';
import { Session } from '../graphql/context';
import { UserResponse } from '../graphql/graphql';
import argon2 from 'argon2';

const prisma = new PrismaClient();
const logger = pino();

export const userService = {
  async findUserById(userId: number): Promise<User> {
    return prisma.user.findUnique({ where: { id: userId } });
  },
  async login(username: string, password: string, session: Session): Promise<UserResponse> {
    try {
      const maybeUser = await prisma.user.findUnique({ where: { username } });
      // Check user exists
      if (maybeUser === null) {
        return failedLogin(username);
      }

      // Check password correct
      const passwordsMatch = await argon2.verify(maybeUser.password, password);
      logger.info('Passwords match %o', { passwordsMatch });
      if (!passwordsMatch) {
        return failedLogin(username);
      }

      session.userId = String(maybeUser.id);
      logger.info(`User ${username} logged in`);
      return { user: maybeUser };
    } catch (error: any) {
      return unexpectedError(error);
    }
  },
  async register(username: string, password: string): Promise<UserResponse> {
    // TODO validate input
    const hashedPassword = await argon2.hash(password);
    try {
      let user = await prisma.user.create({ data: { username: username, password: hashedPassword } });
      // Give user the USER role by default.
      await prisma.role.create({ data: { userId: user.id, name: 'USER' } });
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
  async findAllUsers(): Promise<User[]> {
    return prisma.user.findMany();
  },
};

const failedLogin = (username: string) => {
  logger.info(`Failed login for user ${username}`);
  return { errors: [{ field: 'username', message: `User not found or password incorrect` }] };
};

const unexpectedError = (error: any) => {
  logger.error(error);
  return { errors: [{ message: `Unexpected error: ${JSON.stringify(error)}` }] };
};

const userAlreadyExists = () => {
  return { errors: [{ field: 'username', message: `User already exists with username` }] };
};
