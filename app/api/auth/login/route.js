import { NextResponse } from 'next/server';
import { authenticateUser, createDefaultAdmin } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    console.log('Login API called for username:', username);

    if (!username || !password) {
      console.log('Missing credentials');
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Ensure default admin exists
    await createDefaultAdmin();

    const result = await authenticateUser(username, password);
    console.log('Authentication result:', { success: result.success, username: result.user?.username });

    if (!result.success) {
      console.log('Authentication failed:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    console.log('Creating response for user:', result.user.username);
    
    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Login successful'
    });

    // Set cookie with JWT token (temporarily disable httpOnly for debugging)
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: false, // Temporarily disabled for debugging
      secure: false, // Disable secure for localhost testing
      sameSite: 'lax', // Use lax for localhost compatibility
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    };
    
    console.log('Setting auth cookie with options:', cookieOptions);
    
    // Don't set domain for production - let browser handle it automatically
    response.cookies.set('auth-token', result.token, cookieOptions);

    console.log('Login successful, response created');
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
