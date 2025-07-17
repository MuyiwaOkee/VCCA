import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { decrypt } from "./lib/session"

const protectedRoutes = ['/dashboard', '/predict', '/notifications'];
const publicRoutes = ['/login', '/signup', '/']

export const middleware = async (req: NextRequest) => {
    const path = req.nextUrl.pathname; //get page user is on

    const cookie = (await cookies()).get('session')?.value; //get jwt if available
    const session = await decrypt(cookie);

    // check if the page the user is on is protected or not
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    // if the user is on a protect route and isn't logged in, redirect them to the login page
    if(isProtectedRoute && !session?.userid)
        return NextResponse.redirect(new URL('/login', req.nextUrl));

    // if the user is on a public route and is logged in, redirect them to the dashboard page
    if(isPublicRoute && session?.userid)
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));

    
}