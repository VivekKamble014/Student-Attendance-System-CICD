import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prisma: PrismaClient

try {
  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }
} catch (error: any) {
  if (error.message?.includes('did not initialize')) {
    console.error('\n❌ Prisma Client not generated!')
    console.error('Please run: npx prisma generate\n')
    throw new Error(
      'Prisma Client not initialized. Run "npx prisma generate" first.'
    )
  }
  throw error
}

// Handle Prisma connection errors gracefully (only in development)
if (process.env.NODE_ENV === 'development') {
  prisma.$connect().catch((error) => {
    console.error('⚠️  Prisma connection error:', error.message)
    console.error('💡 Make sure your database is running and DATABASE_URL is correct in .env file')
  })
}

// Export a function to check database connection
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection check failed:', error)
    return false
  }
}

export { prisma }

