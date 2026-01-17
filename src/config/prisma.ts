import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "../generated/prisma/client";
import { env } from '../env';
const connectionString = `${env.DATABASE_URL}`

export const prisma = new PrismaClient()