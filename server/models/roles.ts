import { PrismaClient, User } from '@prisma/client';
import pino from 'pino';

const prisma = new PrismaClient();
const logger = pino();

export const roles = {
  async findRolesForUser(userId: number): Promise<Array<string>> {
    const roles = await prisma.role.findMany({ where: { userId } });
    return roles.map((r) => r.name);
  },
};
