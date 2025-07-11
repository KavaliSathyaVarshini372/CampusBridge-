
import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define admin-only paths
  const adminPaths = ['/events', '/collaborate', '/blog', '/contact', '/admin'];

  const userCookie = request.cookies.get('user');
  let user = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie.value);
    } catch (e) {
      // Invalid cookie
    }
  }

  // If trying to access an admin path
  if (adminPaths.some(p => pathname.startsWith(p))) {
    // and user is not admin, redirect to home
    if (!user || user.email !== 'admin@example.com') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root landing page)
     * - /login (the login page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|$).*)'
  ],
};
