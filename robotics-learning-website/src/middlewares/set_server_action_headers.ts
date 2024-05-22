import { NextRequest, NextResponse } from "next/server";

export function setHeaders(req: NextRequest) {
    const RequestHeaders = new Headers(req.headers);
    RequestHeaders.set("x-forwarded-host", "localhost:3000");
    RequestHeaders.set("origin", "http://localhost:3000");

    const response = NextResponse.next({
        request: {
            headers: RequestHeaders
        },
    })

    response.headers.set("x-middleware-success", "true");
    return response;
}