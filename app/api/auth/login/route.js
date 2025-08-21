import { NextResponse } from 'next/server';
import { authenticateUser, createDefaultAdmin } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Ensure default admin exists
    await createDefaultAdmin();

    const result = await authenticateUser(username, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Login successful'
    });

    // Set HTTP-only cookie with JWT token
    response.cookies.set('auth-token', result.token, {
      httpOnly: true,
      secure: true, // Always use HTTPS in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.netlify.app' : undefined
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
