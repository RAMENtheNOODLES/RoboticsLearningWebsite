import { Database } from "@/app/utils/database";
import { school_class } from "@/app/utils/structures";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    classes?: school_class[],
    error?: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const db = new Database();

    db.getAllClasses().then((classes) => {
        if (classes !== undefined)
            res.status(200).json({ classes: classes })
        else
            res.status(500).end();
    })
}