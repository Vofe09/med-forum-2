import { NextResponse } from "next/server";

export function middleware(req) {
    const user = req.cookies.get("user");

    if (!user && req.nextUrl.pathname.startsWith("/profile")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/profile"]
};
