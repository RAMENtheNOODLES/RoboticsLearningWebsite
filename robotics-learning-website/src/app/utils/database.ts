import {PrismaClient} from "@prisma/client";

import {user, school_class, assignment, grade} from "@/app/utils/structures"

import { randomBytes, scryptSync, timingSafeEqual } from "crypto";


export enum Role {
    STUDENT,
    TEACHER,
    ADMIN
}

export class AuthUtils {

    static generateAuthKey(username: string, email: string, password: string, header?: string): string {
        const hashedUsername: string = AuthUtils.hashPassword(username);
        const hashedEmail: string = AuthUtils.hashPassword(email);
        const HEADER = header ? header + "-" : "";

        return HEADER + AuthUtils.hashPassword(`${hashedUsername}.${hashedEmail}.${password}`);
    }

    static generateToken(username: string, password: string): string {
        return AuthUtils.hashPassword(`${username}.${password}.${randomBytes(16).toString('hex')}`);
    }

    static hashPassword(password: string): string {
        const salt = randomBytes(16).toString('hex');
        const buf = scryptSync(password, salt, 64);
        return `${buf.toString('hex')}.${salt}`;
    }

    static hashPasswordIfExists(password?: string): string {
        if (password)
            return AuthUtils.hashPassword(password);
        else
            return "";
    }

    static verifyPassword(storedPassword: string, suppliedPassword: string): boolean {
        const [hashedPassword, salt] = storedPassword.split('.');
        const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');

        const suppliedPasswordBuf = scryptSync(suppliedPassword, salt, 64);

        return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
    }

    static testPasswordHashing() {
        const password = "password";
        const hashedPassword = AuthUtils.hashPassword(password);
        return AuthUtils.verifyPassword(hashedPassword, password)
    }
}

/**
 * A class that handles all the database interactions
 */
export class Database {
    prisma: PrismaClient

    constructor() {
        globalThis.prisma ??= new PrismaClient();
        this.prisma = globalThis.prisma;
    }

    async login(username: string, password: string, ipAddr: string): Promise<string> {
        return ""
        /*
        const user = await this.prisma.user.findFirst({
            where: {
                name: username
            }
        });

        const SESSION_LENGTH_DAYS = 1;

        if (user) {

            if (!AuthUtils.verifyPassword(user.password, password))
                return "";

            if (!user.lockExpires && user.isLocked)
                return ""

            if (user.lockExpires && user.isLocked && user.lockExpires > new Date(Date.now())) {
                return ""
            } else if (user.lockExpires && user.isLocked && user.lockExpires < new Date(Date.now())) {
                this.prisma.user.update({
                    where: {
                        Id: user.Id
                    },
                    data: {
                        isLocked: false,
                        lockExpires: null
                    }
                });
            }

            const TOKEN = AuthUtils.generateToken(user.name, user.password);

            const session = await this.prisma.sessions.findFirst({
                where: {
                    userId: user.id
                }
            });

            if (session && !AuthUtils.verifyPassword(session.ipAddress, ipAddr)) {
                console.log(`Session: ${session.token}`)
                return ""
            }
            else if (session && AuthUtils.verifyPassword(session.ipAddress, ipAddr)) {
                return session.token;
            }


            await this.prisma.sessions.create({
                data: {
                    ipAddress: AuthUtils.hashPassword(ipAddr),
                    userId: user.id,
                    token: TOKEN,
                    expires: new Date(Date.now() + (1000 * SESSION_LENGTH_DAYS) * 60 * 60 * 24)
                }
            })

            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    lastLogin: new Date(Date.now())
                }
            });

            return AuthUtils.generateToken(user.username, user.password);
        }

        return "";
        */
    }

    async deleteUser(userId: string, executorId: string, authToken: string) {
        if (userId == executorId)
            return false;

        const EXECUTOR = await this.prisma.user.findFirst({
            where: {
                id: executorId
            }
        });

        if (EXECUTOR === undefined)
            return false

        const USER = await this.prisma.user.delete({
            where: {
                id: userId
            }
        })

        return USER !== undefined;


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
            tmp.push(new user(u.id, u.createdAt,
                u.email ?? "", u.name ?? "", u.password ?? "", u.role, this.getStudentsClasses(u.id),
                [], await this.getStudentsAssignments(u.id), [], []));
        }
        return tmp;//.finally(() => this.prisma.$disconnect());
    }

    async getUser(userId: string): Promise<user> {
        let out = new user()

        return this.prisma.user.findFirst({
            where: {
                id: userId
            }
        }).then((u) => {
            console.log(`User: ${u}`)
            if (!u)
                return new user()

            out = new user(u.id, u.createdAt, u.email ?? "", u.name ?? "", u.password ?? "", u.role);
            console.log(`Please: ${out.toString()}`)
            return out;
        });
    }

    async createUser(u: user): Promise<string> {
        return this.prisma.user.create({
            data: {
                name: u.username,
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
                return _user.id;
            return "";
        }).catch(() => {
            return "";
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
            tmp.push(new school_class(String(c.Id), c.createdAt, c.teacherId, teacher, c.title, c.description))
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
            const teacher = await this.getUser(a.teacher.id);
            tmp.push(new assignment(a.Id, a.createdAt, a.classId, a.teacher.id, a.totalPointsPossible, teacher, await this.getClass(a.classId)))
        }

        return tmp;
    }

    getStudentUsername(studentID: string) {
        let out = "";

        this.prisma.user.findFirst({
            where: {
                id: studentID,
                role: Role.STUDENT
            }
        }).then((student) => {
            if (student)
                out = student.name ?? "";
        }).finally(() => this.prisma.$disconnect());

        return out;
    }

    getStudentsClasses(studentId: string): school_class[] {
        let out: school_class[] = []
        this.prisma.user.findFirst({
            where: {
                id: studentId
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
                this.getUser(c.teacher.id).then((teacher) => {
                    if (teacher) {
                        out.push(new school_class(String(c.Id), c.createdAt, c.teacherId, teacher,
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

        return new school_class(String(c.Id), c.createdAt, c.teacherId,
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
            const teacher = await this.getUser(a.teacher.id);

            if (teacher)
                return new assignment(a.Id, a.createdAt, a.classId, a.assigner,
                    a.totalPointsPossible, teacher);
        }

        return new assignment();
    }

    async createAssignment(classId: number, assignerId: string, teacherId: string, c: school_class, total_points_possible: number): Promise<assignment>
    async createAssignment(classId: number, assignerId: string, teacherId: string, c: school_class, total_points_possible: number, students: string[]): Promise<assignment>
    async createAssignment(classId: number, assignerId: string, teacherId: string, c: school_class, total_points_possible: number, students: string[], grades: grade[]): Promise<assignment>
    async createAssignment(classId: number, assignerId: string, teacherId: string, c: school_class, total_points_possible?: number, students?: string[], grades?: grade[]): Promise<assignment> {
        let s: { Id: string; }[] = []

        if (students)
            students.forEach((_student) => {
                s.push({Id: _student});
            })

        let g: { Id: number; }[] = []

        if (grades)
            grades.forEach((_grade) => {
                g.push({Id: _grade.Id});
            })

        const out = await this.prisma.assignment.create({
            data: {
                classId: classId,
                assigner: assignerId,
                totalPointsPossible: total_points_possible ? total_points_possible : 0,
                students: {
                    
                },
                grades: {
                    connect: g
                }
            },
        })

        return new assignment(out.Id, out.createdAt, out.classId, out.assigner, out.totalPointsPossible, await this.getUser(teacherId), await this.getClass(classId));
    }

    async deleteAssignment(assignmentId: number): Promise<boolean> {
        const a = await this.prisma.assignment.delete({
            where: {
                Id: assignmentId
            }
        });

        return (a !== undefined);

    }

    /**
     * Returns a list of ID's of all the assignments a student has
     * @param studentID the id of the student
     * @returns a list of the id's of the assignments the student has
     */
    async getStudentsAssignments(studentID: string) {
        const student = await this.prisma.user.findFirst({
            where: {
                id: studentID
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
        let out: string[] = [];
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
                    out.push(student.id);
            });
        }).catch(() => {
            this.prisma.$disconnect();
            return out;
        }).finally(() => this.prisma.$disconnect());

        return out;
    }

    async addNewUser(u: user): Promise<string> {
        if (u.Id != "")
            return this.prisma.user.create({
                data: {
                    id: u.Id,
                    name: u.username,
                    email: u.email,
                    password: u.password,
                    role: u.role
                }
            }).then(() => {
                return u.Id;
            });

        return this.prisma.user.create({
            data: {
                name: u.username,
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
                return _user.id;
            return "";
        });
    }
}