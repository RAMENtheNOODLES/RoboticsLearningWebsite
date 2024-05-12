import {PrismaClient} from "@prisma/client";

import {user, school_class, assignment, grade} from "@/app/utils/structures"


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
     * @returns a list of users from the database
     */
    async getUsers() {
        const users = await this.prisma.user.findMany({
            include: {
                assignments: true,
                classes: true,
                myAssignments: true,
                myClasses: true,
                myGrades: true
            }
        });
        let tmp: user[] = [];
        for (const u of users) {
            tmp.push(new user(u.Id, u.createdAt,
                u.email, u.username, u.password, u.role, this.getStudentsClasses(u.Id),
                [], await this.getStudentsAssignments(u.Id), [], []));
        }
        return tmp;//.finally(() => this.prisma.$disconnect());
    }

    async getUser(userId: number): Promise<user> {
        let out = new user()

        return this.prisma.user.findFirst({
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
        const classes = await this.prisma.classes.findMany({
            include: {
                teacher: true
            }
        });

        let tmp: school_class[] = []

        for (const c of classes) {
            const teacher = await this.getUser(c.teacherId);
            tmp.push(new school_class(c.Id, c.createdAt, c.teacherId, teacher, c.title, c.description))
        }

        return tmp;
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

    async getAllAssignments() {
        const assignments = await this.prisma.assignment.findMany({
            include: {
                teacher: true,
                students: true,
                grades: true,
            }
        });

        let tmp: assignment[] = []

        for (const a of assignments) {
            const teacher = await this.getUser(a.teacher.Id);
            tmp.push(new assignment(a.Id, a.createdAt, a.classId, a.teacher.Id, a.totalPointsPossible, teacher, await this.getClass(a.classId)))
        }

        return tmp;
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

    async getClass(classId: number): Promise<school_class> {
        const c = await this.prisma.classes.findFirst({
            where: {
                Id: classId
            },
            include: {
                assignments: true,
                teacher: true,
                users: true
            }
        });

        if (!c)
            return new school_class();

        const teacher = await this.getUser(c.teacherId);

        return new school_class(c.Id, c.createdAt, c.teacherId,
            teacher, c.title, c.description)
    }

    async getAssignment(assignmentId: number): Promise<assignment> {
        const a = await this.prisma.assignment.findFirst({
            where: {
                Id: assignmentId
            },
            include: {
                class: true,
                grades: true,
                students: true,
                teacher: true
            }
        })

        if (a) {
            const teacher = await this.getUser(a.teacher.Id);

            if (teacher)
                return new assignment(a.Id, a.createdAt, a.classId, a.assigner,
                    a.totalPointsPossible, teacher);
        }

        return new assignment();
    }

    createAssignment(classId: number, assignerId: number, teacherId: number, c: school_class, total_points_possible: number): void
    createAssignment(classId: number, assignerId: number, teacherId: number, c: school_class, total_points_possible: number, students: number[]): void
    createAssignment(classId: number, assignerId: number, teacherId: number, c: school_class, total_points_possible: number, students: number[], grades: grade[]): void
    createAssignment(classId: number, assignerId: number, teacherId: number, c: school_class, total_points_possible?: number, students?: number[], grades?: grade[]): void {
        let s: { Id: number; }[] = []

        if (students)
            students.forEach((_student) => {
                s.push({Id: _student});
            })

        let g: { Id: number; }[] = []

        if (grades)
            grades.forEach((_grade) => {
                g.push({Id: _grade.Id});
            })

        this.prisma.assignment.create({
            data: {
                classId: classId,
                assigner: assignerId,
                totalPointsPossible: total_points_possible ? total_points_possible : 0,
                students: {
                    connect: s
                },
                grades: {
                    connect: g
                }
            },
        });
    }

    /**
     * Returns a list of ID's of all the assignments a student has
     * @param studentID the id of the student
     * @returns a list of the id's of the assignments the student has
     */
    async getStudentsAssignments(studentID: number) {
        const student = await this.prisma.user.findFirst({
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
        })

        if (!student)
            return [];

        let tmp: assignment[] = []

        student.myAssignments.forEach((a) => {
            if (a)
                this.getAssignment(a.Id).then((as) => { tmp.push(as) })
        })

        return tmp;
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
            return this.prisma.user.create({
                data: {
                    Id: u.Id,
                    username: u.username,
                    email: u.email,
                    password: u.password,
                    role: u.role
                }
            }).then(() => {
                return u.Id;
            });

        return this.prisma.user.create({
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
        });
    }
}