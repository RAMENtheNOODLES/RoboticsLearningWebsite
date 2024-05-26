import { Pool } from "@neondatabase/serverless"

export {}

declare global {
    var prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
    var pool: Pool
    var adapter: PrismaNeon
}