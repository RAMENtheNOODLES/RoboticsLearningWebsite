import { Database } from "@/app/utils/database";
import { school_class } from "@/app/utils/structures";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    class?: school_class,
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


    db.getClass(Number(id)).then((c) => {

        if (!c) {
            res.status(404).end(`No class with id: ${id}`);
            return;
        }

        console.log(`Out: ${c.toString()}`)

        res.status(200).json({class: c})
    });
    return;
}