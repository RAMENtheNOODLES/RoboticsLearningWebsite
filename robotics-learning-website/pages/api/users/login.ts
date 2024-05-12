import { Database } from "@/app/utils/database";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    token?: string,
    error?: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const db = new Database();
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded !== "string") {
        res.status(500).end(`Error logging in`);
        return;
    }

    const ip = forwarded ? forwarded.split(/, /)[0] : req.socket.remoteAddress;

    if (ip === undefined) {
        res.status(500).end(`Error logging in`);
        return;
    }

    const { username, password } = req.body;

    db.login(username, password, ip).then((t) => {
        if (t !== "")
            res.status(200).json({token: t})
        else
            res.status(500).end(`Error logging in`);
    });

    return;
}