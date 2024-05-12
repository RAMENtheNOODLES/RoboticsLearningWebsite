import {AuthUtils} from "@/app/utils/database";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    success?: boolean,
    error?: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {

    const result = AuthUtils.testPasswordHashing();

    if (result) {
        res.status(200).json({success: true});
    } else {
        res.status(500).json({error: "Error testing password hashing"});
    }

}