/*
    Generate http tests for the api in /pages/api
*/

import { assert } from "console"
import { user, school_class, assignment } from "@/lib/structures"
import { Database } from "@/lib/database"

class HttpTests {
    db = new Database();

    async runTests() {
        let users = await this.testGetUsers();
        let classes = await this.testGetClasses();
        let assignments = await this.testGetAssignments();

        let newAdminUser = await this.testCreateUser(new user(undefined, undefined, "run_tests", "run_tests", "run_tests", 2));
        let newTeacher = await this.testCreateUser(new user(undefined, undefined, "teacher_run_tests", "run_tests", "run_tests", 1));
        let newClass = await this.testCreateClass(new school_class(undefined, undefined, newTeacher.Id, newTeacher, "run_tests"));
        let newAssignment = await this.testCreateAssignment(new assignment(undefined, undefined, newClass.Id, newTeacher.Id, 100, newTeacher, newClass));

        let userById = await this.testGetUserById(newAdminUser.Id);
        assert(userById === newAdminUser);

        let classById = await this.testGetClassById(newClass.Id);
        assert(classById === newClass);

        let success = await this.testDeleteAssignment(newAssignment.Id);
        assert(success);

        success = await this.testDeleteUser(newTeacher.Id, newAdminUser);
        assert(success);
    }

    async testGetUsers(): Promise<user[]> {
        let response = await fetch("/api/users", {
            method: "GET",
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json"
            }
        })
        assert(response.ok)
        let data = await response.json()
        assert(data)
        assert(data["users"])
        assert(data["users"].length > 0)

        return data["users"].map((u: any) => user.fromJSON(u));
    }

    async testGetClasses(): Promise<school_class[]> {
        let response = await fetch("/api/classes", {
            method: "GET",
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json"
            }
        })
        assert(response.ok)
        let data = await response.json()
        assert(data)
        assert(data["classes"])
        assert(data["classes"].length > 0)

        return data["classes"].map((c: any) => school_class.fromJSON(c));
    }

    async testCreateUser(u: user): Promise<user> {
        let response = await fetch("/api/users", {
            method: "POST",
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify(u)
        })
        assert(response.ok)
        let data = await response.json()
        assert(data)
        assert(data["user"])

        return user.fromJSON(data["user"]);
    }

    async testCreateClass(c: school_class): Promise<school_class> {
        let response = await fetch("/api/classes", {
            method: "POST",
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify(c)
        })
        assert(response.ok)
        let data = await response.json()
        assert(data)
        assert(data["class"])


        return school_class.fromJSON(data["class"]);
    }

    async testGetAssignments(): Promise<assignment[]> {
        let response = await fetch("/api/assignments", {
            method: "GET",
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json"
            }
        })
        assert(response.ok)
        let data = await response.json()
        assert(data)
        assert(data["assignments"])
        assert(data["assignments"].length > 0)

        return data["assignments"].map((a: any) => assignment.fromJSON(a));
    }

    async testCreateAssignment(a: assignment): Promise<assignment> {
        let response = await fetch("/api/assignments", {
            method: "POST",
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                classId: a.classId,
                assignerId: a.assigner,
                teacherId: a.teacher.Id,
                c: a.class,
                totalPointsPossible: a.totalPointsPossible
            })
        })
        assert(response.ok)
        let data = await response.json()
        assert(data)
        assert(data["assignment"])

        assert(assignment.fromJSON(data["assignment"]) === a);

        return assignment.fromJSON(data["assignment"]);
    }

    async testDeleteAssignment(id: number): Promise<boolean> {
        let response = await fetch(`/api/assignments?id=${id}`, {
            method: "DELETE",
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json"
            }
        })
        assert(response.ok)
        let data = await response.json()
        assert(data)
        assert(data["success"])

        return data["success"];
    }

    async testGetUserById(id: number): Promise<user> {
        let response = await fetch(`/api/users?id=${id}`, {
            method: "GET",
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json"
            }
        })
        assert(response.ok)
        let data = await response.json()
        assert(data)
        assert(data["user"])

        return user.fromJSON(data["user"]);
    }

    async testGetClassById(id: number): Promise<school_class> {
        let response = await fetch(`/api/classes?id=${id}`, {
            method: "GET",
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json"
            }
        })
        assert(response.ok)
        let data = await response.json()
        assert(data)
        assert(data["class"])

        return school_class.fromJSON(data["class"]);
    }

    async testDeleteUser(id: number, executor: user): Promise<boolean> {
        let response = await fetch(`/api/users?id=${id}`, {
            method: "DELETE",
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                executorId: executor.Id,
                "auth-key": await this.db.prisma.user.findUnique({where: {Id: executor.Id}}).then((u) => u?.authKey)
            })
        })
        assert(response.ok)
        let data = await response.json()
        assert(data)
        assert(data["success"])

        return data["success"];
    }


}

let tests = new HttpTests();
tests.runTests().then(() => {
    console.log("All tests passed")
}).catch((e) => {
    console.error("Test failed: ", e)
})