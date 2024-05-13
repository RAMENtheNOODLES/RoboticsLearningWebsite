import { Database } from "@/app/utils/database";
import { user } from "@/app/utils/structures";
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

    const { id } = req.query;

    if (id === undefined) {
        console.warn("No id");
        res.status(404).end(`Id: ${id}`);
        return;
    }

    if (req.method == "GET") {
        db.getUser(Number(id)).then((u) => {

            console.log(`Out: ${u.toString()}`)

            if (u.toString() === new user().toString()) {
                res.status(404).end(`No user with id: ${id}`);
                return;
            }

            res.status(200).json({user: u})
        });
        return;
    }
    else if (req.method == "DELETE") {
        db.deleteUser(Number(id), Number(req.body["executorId"]), req.body["auth-key"]).then((success) => {
            if (success) {
                res.status(200).end(`Success!`)
                return;
            }
            res.status(500).end(`Could not delete user...`);
            return;
        })

        return;
    }
}