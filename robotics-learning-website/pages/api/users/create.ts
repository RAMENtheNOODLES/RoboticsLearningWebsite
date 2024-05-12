import { Database } from "@/app/utils/database";
import { user } from "@/app/utils/structures";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    userId?: number,
    error?: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const db = new Database();

    const { username, email, password, role } = req.body;

    if (role > 2 || role < 0) {
        res.status(500).end(`Error creating user: invalid role`);
        return;
    }

    const USER = new user(undefined, undefined, email, username, password, role);

    db.createUser(USER).then((u) => {
        if (u !== -1)
            res.status(200).json({userId: u})
        else
            res.status(500).end(`Error creating user`);
    });

    return;
}