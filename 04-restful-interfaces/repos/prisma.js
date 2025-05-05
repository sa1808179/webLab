import { PrismaClient } from "@prisma/client"

// Create a new PrismaClient instance with explicit configuration
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["query", "info", "warn", "error"],
  })
}

// Use globalThis to store the singleton instance
const globalForPrisma = globalThis
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// In development, keep the connection alive between hot reloads
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
