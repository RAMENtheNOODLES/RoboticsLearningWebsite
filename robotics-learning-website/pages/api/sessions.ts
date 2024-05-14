import { Database } from "@/app/utils/database";
import {user} from "@/app/utils/structures";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    user?: user,
    error?: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const db = new Database();

    //const { ip } = req.query;
    const { token, ip } = req.body;

    if (ip === undefined) {
        console.warn("No id");
        res.status(404).end(`Id:`);
        return;
    }

    db.getSession(token, ip).then((u) => {
        if (!u) {
            console.error("No id");
            res.status(404).end(`No session with id: `);
            return;
        }

        console.log(`Out: ${u.toString()}`)

        res.status(200).json({user: u})
    });
    return;
}