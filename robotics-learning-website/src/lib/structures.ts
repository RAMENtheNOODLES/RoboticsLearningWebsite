import {AuthUtils} from "@/lib/database";

export class assignment {
    Id: number
    createdAt: Date|null
    classId: number
    assigner: string
    totalPointsPossible: number
    teacher: user
    students: user[]
    grades: grade[]
    class: school_class
    
    constructor()
    constructor(id?: number, created_at?: Date, classId?: number, assigner?: string, 
        total_points_possible?: number, teacher?: user, School_Class?: school_class)
    constructor(id?: number, created_at?: Date, classId?: number, assigner?: string, 
        total_points_possible?: number, teacher?: user, School_Class?: school_class, 
        students?: user[], grades?: grade[]) {
            this.Id = id ? id : -1;
            this.createdAt = created_at ? created_at : null;
            this.classId = classId ? classId : -1;
            this.assigner = assigner ?? "";
            this.totalPointsPossible = total_points_possible ? total_points_possible : 0;
            if (!teacher)
                throw new Error("Teacher must not be null")
            this.teacher = teacher;
            if (!School_Class)
                throw new Error("Class must not be null")
            this.class = School_Class;
            this.students = students ? students : [];
            this.grades = grades ? grades : [];
    }

    static fromJSON(d: Object): assignment {
        return Object.assign(new assignment(), d)
    }

    toString() {
        return JSON.stringify(this, null, 4)
    }
}

export enum FileLocations {
    USER,
    CLASS,
    SERVER_SIDE,
    TEMP,
}

export class file {
    Id: number
    userId: string
    fileName: string
    fileLocation: FileLocations
    user: user

    
    constructor()
    constructor(id: number, userId: string, fileName: string, fileLocation: FileLocations, user: user)
    constructor(id?: number, userId?: string, fileName?: string, fileLocation?: FileLocations, u?: user) {
        this.Id = id ?? -1
        this.userId = userId ?? ""
        this.fileName = fileName ?? ""
        this.fileLocation = fileLocation ?? FileLocations.USER
        this.user = u ?? new user()
    }

}

export class grade {
    Id: number
    assignmentId: number
    pointsEarned: number = 0;
    totalPoints: number = 0;
    studentId: number
    student: user
    assignment: assignment

    constructor(id: number, assignmentId: number, studentId: number, 
        student: user, assignment: assignment)
    constructor(id: number, assignmentId: number, studentId: number, 
        student: user, assignment: assignment, points_earned: number = 0, total_points: number = 0) {
            this.Id = id;
            this.assignmentId = assignmentId;
            this.pointsEarned = points_earned;
            this.totalPoints = total_points;
            this.studentId = studentId;
            this.student = student;
            this.assignment = assignment;
    }

    static fromJSON(d: Object): assignment {
        return Object.assign(new assignment(), d)
    }

    toString() {
        return JSON.stringify(this, null,4)
    }
}

export class user {
    Id: string
    createdAt: Date|null
    email: string
    username: string
    password: string // Hashed
    role: string
    authkey: string = ""
    classes: school_class[] = []
    myClasses: school_class[] = []
    assignments: assignment[] = []
    myAssignments: assignment[] = []
    myGrades: grade[] = []

    constructor()
    constructor(id?: string, created_at?: Date, email?: string, username?: string, password?: string, role?: string)
    constructor(id: string, created_at: Date, email: string, username: string, password: string, role: string)
    constructor(id: string, created_at: Date, email: string, username: string, password: string, role: string, 
        classes: school_class[], my_classes: school_class[], 
        assignments: assignment[], my_assignments: assignment[], my_grades: grade[])
    constructor(id?: string, created_at?: Date, email?: string, username?: string, password?: string, role?: string, 
        classes?: school_class[], my_classes?: school_class[], 
        assignments?: assignment[], my_assignments?: assignment[], my_grades?: grade[]) {
            this.Id = id ? id : "";
            this.createdAt = created_at ? created_at : null
            this.email = email ? email : ""
            this.username = username ? username : ""
            this.password = AuthUtils.hashPasswordIfExists(password)
            this.role = role ?? "student"
            this.classes = classes ? classes : []
            this.myClasses = my_classes ? my_classes : []
            this.assignments = assignments ? assignments : []
            this.myAssignments = my_assignments ? my_assignments : []
            this.myGrades = my_grades ? my_grades : []
    }

    static fromJSON(d: Object): user {
        return Object.assign(new user(), d)
    }

    toString() {
        return JSON.stringify(this, null,4)
    }
}

export class school_class {
    Id: string
    createdAt: Date|null
    teacherId: string
    teacher: user|null
    title: string
    description: string
    users: user[]
    assignments: assignment[]

    constructor()
    constructor(id?: string, created_at?: Date, teacherId?: string, teacher?: user, title?: string)
    constructor(id: string, created_at: Date, teacherId: string, teacher: user, title: string)
    constructor(id: string, created_at: Date, teacherId: string, teacher: user, title: string, description?: string)
    constructor(id: string, created_at: Date, teacherId: string, teacher: user, title: string, description: string)
    constructor(id: string, created_at: Date, teacherId: string, teacher: user, title: string, description: string,
        users?: user[], assignments?: assignment[])
    constructor(id: string, created_at: Date, teacherId: string, teacher: user, title: string, description: string,
                users: user[], assignments: assignment[])
    constructor(id?: string, created_at?: Date, teacherId?: string, teacher?: user, title?: string, description?: string,
                users?: user[], assignments?: assignment[]) {
            this.Id = id ?? "";
            this.createdAt = created_at ? created_at : null;
            this.teacherId = teacherId ?? ""
            this.teacher = teacher ? teacher : null;
            this.title = title ? title : "";
            this.description = description ? description : ""
            this.users = users ? users : []
            this.assignments = assignments ? assignments : []
    }

    static fromJSON(d: Object): school_class {
        return Object.assign(new school_class(), d)
    }

    toString() {
        return JSON.stringify(this, null, 4)
    }
}