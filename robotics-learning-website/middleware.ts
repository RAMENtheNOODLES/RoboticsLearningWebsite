import { auth } from "@/auth";
import authConfig from "@/auth.config";
import { setHeaders } from "@/middlewares/set_server_action_headers";
import NextAuth from "next-auth";
//import { setHeaders } from "@/middlewares/set_server_action_headers";
import { NextRequest, NextResponse } from "next/server";

export default NextAuth(authConfig).auth((req) => {
    if (req.nextUrl.pathname.startsWith("/login")) {
        return setHeaders(req);
    }
})

/*
export function middleware(request: NextRequest, response: NextResponse) {
    if (request.nextUrl.pathname.startsWith("/auth")) {
        console.log("auth")
        return NextAuth(authConfig).auth;
    }
    return NextResponse;
}
*/

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}