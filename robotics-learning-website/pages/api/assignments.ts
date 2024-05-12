import { Database } from "@/app/utils/database";
import { assignment } from "@/app/utils/structures";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    assignments?: assignment[]
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const db = new Database();

    db.getAllAssignments().then((assignments) => {
        if (assignments !== undefined)
            res.status(200).json({ assignments: assignments })
        else
            res.status(500).end();
    })
}