import { PrismaClient } from "@prisma/client";

class Database {
    prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient();
    }
}