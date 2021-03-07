import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export type Session = { userId?: string };
type SessionedRequest = Request & { session: Session };

export interface Context {
  prisma: PrismaClient;
  req: SessionedRequest;
  res: Response;
}

export function createContext(req: SessionedRequest, res: Response): Context {
  return { prisma, req, res };
}
