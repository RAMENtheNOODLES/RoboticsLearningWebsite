import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Database } from '@/app/utils/database'

// 1. Specify protected and public routes
const protectedRoutes: string[] = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)

    const forwarded = req.headers.get('x-forwarded-for');

    const cookieStore = cookies()

    let sessionToken = cookies().get("token")?.value

    console.log(`Session Token: ${sessionToken}`)

    sessionToken = sessionToken ? sessionToken : ""

    const IP = (forwarded ? forwarded.split(/, /)[0] : "")

    if (!sessionToken && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    else if (!sessionToken && isPublicRoute) {
        return NextResponse.next()
    }

    const session = (await (await fetch('http://localhost:3000/api/sessions/', {
        method: "POST",
        headers: { 'Accept': "application/json", 'Content-Type': "application/json" },
        body: JSON.stringify({ token: sessionToken, ip: IP })
    })).json()).user

    // 5. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // 6. Redirect to /dashboard if the user is authenticated
    if (
        isPublicRoute &&
        session &&
        !req.nextUrl.pathname.startsWith('/dashboard')
    ) {
        cookies().set("sessionID", session.id)
        cookies().set("token", session.token)
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }

    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}