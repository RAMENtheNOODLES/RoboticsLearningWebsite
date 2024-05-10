
export class assignment {
    Id: number
    createdAt: Date|null
    classId: number
    assigner: number
    totalPointsPossible: number
    teacher: user
    students: user[]
    grades: grade[]
    class: school_class
    
    constructor()
    constructor(id?: number, created_at?: Date, classId?: number, assigner?: number, 
        total_points_possible?: number, teacher?: user, School_Class?: school_class)
    constructor(id?: number, created_at?: Date, classId?: number, assigner?: number, 
        total_points_possible?: number, teacher?: user, School_Class?: school_class, 
        students?: user[], grades?: grade[]) {
            this.Id = id ? id : -1;
            this.createdAt = created_at ? created_at : null;
            this.classId = classId ? classId : -1;
            this.assigner = assigner ? assigner : -1;
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
        const o = Object.assign(new assignment(), d)
        return o
    }

    toString() {
        return JSON.stringify(this, null)
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
        const o = Object.assign(new assignment(), d)
        return o
    }

    toString() {
        return JSON.stringify(this, null)
    }
}

export class user {
    Id: number
    createdAt: Date|null
    email: string
    username: string
    password: string
    role: number
    classes: school_class[] = []
    myClasses: school_class[] = []
    assignments: assignment[] = []
    myAssignments: assignment[] = []
    myGrades: grade[] = []

    constructor()
    constructor(id?: number, created_at?: Date, email?: string, username?: string, password?: string, role?: number)
    constructor(id: number, created_at: Date, email: string, username: string, password: string, role: number)
    constructor(id: number, created_at: Date, email: string, username: string, password: string, role: number, 
        classes: school_class[], my_classes: school_class[], 
        assignments: assignment[], my_assignments: assignment[], my_grades: grade[])
    constructor(id?: number, created_at?: Date, email?: string, username?: string, password?: string, role?: number, 
        classes?: school_class[], my_classes?: school_class[], 
        assignments?: assignment[], my_assignments?: assignment[], my_grades?: grade[]) {
            this.Id = id ? id : -1;
            this.createdAt = created_at ? created_at : null
            this.email = email ? email : ""
            this.username = username ? username : ""
            this.password = password ? password : ""
            this.role = role ? role : 0
            this.classes = classes ? classes : []
            this.myClasses = my_classes ? my_classes : []
            this.assignments = assignments ? assignments : []
            this.myAssignments = my_assignments ? my_assignments : []
            this.myGrades = my_grades ? my_grades : []
    }

    static fromJSON(d: Object): user {
        const o = Object.assign(new user(), d)
        return o
    }

    toString() {
        return JSON.stringify(this, null)
    }
}

export class school_class {
    Id: number
    createdAt: Date
    teacherId: number
    teacher: user
    title: string
    description: string
    users: user[]
    assignments: assignment[]

    constructor(id: number, created_at: Date, teacherId: number, teacher: user, title: string)
    constructor(id: number, created_at: Date, teacherId: number, teacher: user, title: string, description?: string)
    constructor(id: number, created_at: Date, teacherId: number, teacher: user, title: string, description?: string,
        users?: user[], assignments?: assignment[]) {
            this.Id = id;
            this.createdAt = created_at;
            this.teacherId = teacherId;
            this.teacher = teacher;
            this.title = title;
            this.description = description ? description : ""
            this.users = users ? users : []
            this.assignments = assignments ? assignments : []
    }

    static fromJSON(d: Object): assignment {
        const o = Object.assign(new assignment(), d)
        return o
    }

    toString() {
        return JSON.stringify(this, null)
    }
}