import type { NextApiRequest, NextApiResponse } from "next";
import { Database } from "@/app/utils/database";
import { user } from "@/app/utils/structures";

type ResponseData = {
    user?: user,
    error?: string
}

/*
    Request:
        {
            userID: num
        }
*/

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const db = new Database();

    console.log(`UserID: ${req.body["userID"]}`)

    db.getUser(req.body["userID"]).then((u) => {

        console.log(`Out: ${u.toString()}`)

        if (!u) {
            res.status(500).json({ error: "Internal Server Error"});
            return;
        }

        res.status(200).json({ user: u})
    });
}