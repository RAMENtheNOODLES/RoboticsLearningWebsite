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
    return;
}