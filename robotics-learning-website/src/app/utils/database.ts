import { PrismaClient } from "@prisma/client";

class Database {
    prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Retrieves all the users from the database
     * @returns a list of users from the data base
     */
    getUsers() {
        this.prisma.$connect()

        let out = null;

        this.prisma.user.findMany().then((users) => {
            out = users;
        }).finally(this.prisma.$disconnect);

        return out;
    }

    getClasses() {
        this.prisma.$connect()

        let out = null;

        this.prisma.classes.findMany().then((classes) => {
            out = classes;
        }).finally(this.prisma.$disconnect);

        return out;
    }
}