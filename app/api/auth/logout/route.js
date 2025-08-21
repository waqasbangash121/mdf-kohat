import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

    // Clear the auth token cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: false, // Match login cookie settings
      secure: false, // Disable secure for localhost testing
      sameSite: 'lax', // Use lax for localhost compatibility
      maxAge: 0,
      path: '/'
    };
    
    response.cookies.set('auth-token', '', cookieOptions);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
