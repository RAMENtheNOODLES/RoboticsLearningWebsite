import { auth } from "@/auth";
import { setHeaders } from "@/middlewares/set_server_action_headers";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest, response: NextResponse) {
    if (request.nextUrl.pathname.startsWith("/auth")) {
        console.log("auth")
        return auth();
    }

    if (request.nextUrl.pathname.startsWith("/login")) {
        return setHeaders(request, response);
    }

    //return NextResponse.next();
}