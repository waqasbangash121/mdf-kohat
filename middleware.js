import { NextResponse } from 'next/server';

// Simple JWT verification for Edge Runtime (without Node.js crypto)
async function verifyTokenSimple(token) {
  try {
    if (!token) return null;
    
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;
    
    // For Edge Runtime, we'll do basic token structure validation
    // The actual JWT verification will be done in API routes
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    try {
      const payload = JSON.parse(atob(parts[1]));
      // Check if token is expired
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/setup', '/api/auth'];
  
  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Get the auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  const allCookies = request.cookies.getAll();
  
  console.log('Middleware:', { 
    pathname, 
    hasToken: !!token, 
    isPublicPath,
    allCookies: allCookies.map(c => c.name)
  });
  
  // If trying to access a protected route without a valid token
  if (!isPublicPath && !token) {
    console.log('Redirecting to login - no token');
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Verify token for protected routes
  if (!isPublicPath && token) {
    const decoded = await verifyTokenSimple(token);
    if (!decoded) {
      console.log('Redirecting to login - invalid token');
      const response = NextResponse.redirect(new URL('/login', request.url));
      // Clear invalid token
      response.cookies.set('auth-token', '', {
        httpOnly: false, // Match login cookie settings
        secure: false,
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });
      return response;
    }
  }
  
  // If trying to access login page while already authenticated
  if (pathname === '/login' && token) {
    const decoded = await verifyTokenSimple(token);
    if (decoded) {
      console.log('Redirecting to dashboard - already authenticated');
      return NextResponse.redirect(new URL('/', request.url));
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
