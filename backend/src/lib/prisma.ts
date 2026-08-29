import { PrismaClient } from "@prisma/client";

// Reuse a single instance across module reloads (tsx watch) to avoid
// exhausting SQLite/Postgres connections in development.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
