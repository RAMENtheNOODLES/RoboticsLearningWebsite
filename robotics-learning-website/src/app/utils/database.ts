import { PrismaClient, User } from "@prisma/client";

export enum Role {
    STUDENT,
    TEACHER,
    ADMIN
}

export class Database {
    prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Retrieves all the users from the database
     * @returns a list of users from the data base
     */
    getUsers() {
        let out: User[] = []
        this.prisma.user.findMany().then((users) => {
            users.forEach((user) => {
                out.push(user)
            })
        }).finally(() => this.prisma.$disconnect());

        return out;
    }

    getClasses() {
        let out = null;
        this.prisma.classes.findMany().then((classes) => {
            out = classes;
        }).finally(() => this.prisma.$disconnect());

        return out;
    }

    getClassTitle(classID: number) {
        let out = "";

        this.prisma.classes.findFirst({
            where: {
                Id: classID
            }
        }).then((c) => {
            if (c)
                out = c.title
        }).finally(() => this.prisma.$disconnect());

        return out;
    }

    getAssignments() {
        let out = null;

        this.prisma.assignment.findMany().then((assignments) => {
            out = assignments;
        }).finally(() => this.prisma.$disconnect());

        return out;
    }

    getStudentUsername(studentID: number) {
        let out = "";

        this.prisma.user.findFirst({
            where: {
                Id: studentID,
                role: Role.STUDENT
            }
        }).then((student) => {
            if (student)
                out = student.username;
        }).finally(() => this.prisma.$disconnect());

        return out;
    }

    /**
     * Returns a list of Id's of all the assignments a student has
     * @param studentID the id of the student
     * @returns a list of the id's of the assignments the student has
     */
    getStudentsAssignments(studentID: number) {
        let out: number[] = [];

        this.prisma.user.findFirst({
            where: {
                Id: studentID
            },
            include: {
                myAssignments: true
            }
        }).then((user) => {
            if (user) {
                user.myAssignments.forEach((assignment) => {
                    out.push(assignment.Id);
                })
            }  
        }).finally(() => this.prisma.$disconnect());

        return out;
    }

    /**
     * Returns a list of student id's of every student assigned to an assignment
     * @param assignmentID the id of the assignment to check
     * @returns A list of student id's that are assigned
     */
    getStudentsAssignedToAssignment(assignmentID: number) {
        let out: number[] = [];
        this.prisma.assignment.findFirstOrThrow({
            where: {
                Id: assignmentID
            },
            include: {
                students: true
            }
        }).then((assignment) => {
            assignment.students.forEach((student) => {
                if (student.role == Role.STUDENT)
                    out.push(student.Id);
            });
        }).catch(() => {
            this.prisma.$disconnect();
            return out;
        }).finally(() => this.prisma.$disconnect());

        return out;
    }
}