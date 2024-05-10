import { PrismaClient, User } from "@prisma/client";

import { user, school_class, assignment, grade } from "@/app/utils/structures"

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
        let out: user[] = []
        this.prisma.user.findMany({
            include: {
                assignments: true,
                classes: true,
                myAssignments: true,
                myClasses: true,
                myGrades: true
            }
        }).then((users) => {
            users.forEach((u) => {
                out.push(new user(u.Id, u.createdAt, 
                    u.email, u.username, u.password, u.role, this.getStudentsClasses(u.Id),
                    [], this.getStudentsAssignments(u.Id), [], []))
            })
        }).finally(() => this.prisma.$disconnect());

        return out;
    }

    async getUser(userId: number): Promise<user> {
        let out = new user()

        return await this.prisma.user.findFirst({
            where: {
                Id: userId
            }
        }).then((u) => {
            console.log(`User: ${u}`)
            if (!u)
                return new user()

            out = new user(u.Id, u.createdAt, u.email, u.username, u.password, u.role);
            console.log(`Please: ${out.toString()}`)
            return out;
        });
    }

    async getAllClasses() {
        return await this.prisma.classes.findMany().then((classes) => {
            let out: school_class[] = []
            classes.forEach((c) => {
                this.getClass(c.Id).then((c) => {
                    if (c)
                        out.push(c);
                })
            });
            return out;
        });
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

    getAllAssignments() {
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

    getStudentsClasses(studentId: number): school_class[] {
        let out: school_class[] = []
        this.prisma.user.findFirst({
            where: {
                Id: studentId
            },
            include: {
                myClasses: {
                    include: {
                        assignments: true,
                        teacher: true,
                        users: true
                    }
                }
            }
        }).then((student) => {
            if (!student || student.role != 0)
                return [];

            student.myClasses.forEach((c) => {
                this.getUser(c.teacher.Id).then((teacher) => {
                    if (teacher) {
                        out.push(new school_class(c.Id, c.createdAt, c.teacherId, teacher,
                            c.title, c.description))
                    }   
                })
                
            })
        })

        return out;
    }

    async getClass(classId: number): Promise<school_class|null> {
        return await this.prisma.classes.findFirst({
            where: {
                Id: classId
            },
            include: {
                assignments: true,
                teacher: true,
                users: true
            }
        }).then((c) => {
            if (c) {
                this.getUser(c.teacher.Id).then((teacher) => {
                    if (teacher)
                        return new school_class(c.Id, c.createdAt, c.teacherId, 
                            teacher, c.title, c.description)
                });
            }
            return null;
        })
    }

    getAssignment(assignmentId: number): assignment|null {
        let out: assignment|null = null;
        this.prisma.assignment.findFirst({
            where: {
                Id: assignmentId
            },
            include: {
                class: true,
                grades: true,
                students: true,
                teacher: true
            }
        }).then((a) => {
            if (a) {
                this.getUser(a.teacher.Id).then((teacher) => {
                    if (teacher)
                        out = new assignment(a.Id, a.createdAt, a.classId, a.assigner, 
                            a.totalPointsPossible, teacher);
                });
            }
        })

        return out;
    }

    /**
     * Returns a list of Id's of all the assignments a student has
     * @param studentID the id of the student
     * @returns a list of the id's of the assignments the student has
     */
    getStudentsAssignments(studentID: number) {
        let out: assignment[] = [];

        this.prisma.user.findFirst({
            where: {
                Id: studentID
            },
            include: {
                myAssignments: {
                    include: {
                        class: true,
                        grades: true,
                        students: true,
                        teacher: true
                    }
                }
            }
        }).then((user) => {
            if (user) {
                user.myAssignments.forEach((assignment) => {
                    let a = this.getAssignment(assignment.Id)
                    if (a)
                        out.push(a);
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

    async addNewUser(u: user): Promise<number> {
        if (u.Id != -1)
            return await this.prisma.user.create({
                data: {
                    Id: u.Id,
                    username: u.username,
                    email: u.email,
                    password: u.password,
                    role: u.role
                }
            }).then(() => {
                return u.Id;
            })

        return await this.prisma.user.create({
            data: {
                username: u.username,
                email: u.email,
                password: u.password,
                role: u.role
            }
        }).then(async () => {
            const _user = await this.prisma.user.findFirst({
                where: {
                    email: u.email
                }
            });
            if (_user)
                return _user.Id;
            return -1;
        })
    }
}