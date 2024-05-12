import { Database } from "@/app/utils/database";
import {assignment} from "@/app/utils/structures";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    assignment?: assignment,
    error?: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const db = new Database();

    const { id } = req.query;

    if (id === undefined) {
        console.warn("No id");
        res.status(404).end(`Id: ${id}`);
        return;
    }


    db.getAssignment(Number(id)).then((a) => {

        if (!a) {
            res.status(404).end(`No assignment with id: ${id}`);
            return;
        }

        console.log(`Out: ${a.toString()}`)

        res.status(200).json({assignment: a})
    });
    return;
}