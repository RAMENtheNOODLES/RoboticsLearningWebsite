import { Database } from "@/app/utils/database";
import { school_class } from "@/app/utils/structures";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    class?: school_class[],
    error?: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const db = new Database();

    db.getAllClasses().then((classes) => {
        if (classes)
            res.status(200).json({ class: classes})
    })

    
    res.status(501)//.json({ message: 'Hello from Next.js!'})
}