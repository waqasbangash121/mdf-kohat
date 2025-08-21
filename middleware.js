import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/api/auth/login'];
  
  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Get the auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // If trying to access a protected route without a valid token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If trying to access login page while already authenticated
  if (pathname === '/login' && token) {
    try {
      const decoded = verifyToken(token);
      if (decoded) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Token is invalid, allow access to login page
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
