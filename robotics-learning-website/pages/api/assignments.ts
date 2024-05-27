import { Database } from "@/lib/database";
import { assignment } from "@/lib/structures";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    assignments?: assignment[],
    assignment?: assignment,
    success?: boolean,
    error?: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const db = new Database();

    if (req.method === "GET") {
        db.getAllAssignments().then((assignments) => {
            if (assignments !== undefined)
                res.status(200).json({assignments: assignments})
            else
                res.status(500).end();
        })
    }
    else if (req.method === "POST") {
        // Create an assignment
        /*
        classId: number,     assignerId: number,     teacherId: number,     c: school_class,     total_points_possible: number
         */
        const { classId, assignerId, teacherId, c, totalPointsPossible } = req.body;

        db.createAssignment(classId, assignerId, teacherId, c, totalPointsPossible).then((a) => {
            if (a !== undefined)
                res.status(200).json({assignment: a})
            else
                res.status(500).end(`Error creating assignment`);
        });
    }
    else if (req.method === "DELETE") {
        const { id } = req.query;

        if (id === undefined) {
            console.warn("No id");
            res.status(404).end(`Id: ${id}`);
            return;
        }

        db.deleteAssignment(Number(id)).then((a) => {
            res.status(a ? 200 : 500).json({success: a, error: a ? undefined : "Error deleting assignment"});
        });
    }
    else {
        res.status(500).end();
    }
}