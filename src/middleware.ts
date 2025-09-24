import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // Allow if a session token exists (don't rely on a specific property name)
  if (token) {
    return NextResponse.next();
  }

  // For API requests, return JSON 401 instead of redirecting
  if (request.nextUrl.pathname.startsWith('/api/cart')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // For page requests, redirect to login with callback
  const loginUrl = new URL('/auth/login', request.url);
  loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/cart', '/api/cart/:path*'],
}
