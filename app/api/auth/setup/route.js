import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../../../lib/auth';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { username, email, password, name } = await request.json();

    // Validate input
    if (!username || !email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if setup is still needed (double-check)
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return NextResponse.json(
        { error: 'Setup has already been completed' },
        { status: 400 }
      );
    }

    // Check if username or email already exists (though it shouldn't at this point)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create the first admin user
    const admin = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
        isActive: true
      }
    });

    console.log('First admin user created during setup:', admin.username);

    return NextResponse.json({
      success: true,
      message: 'Administrator account created successfully',
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Setup error:', error);
    
    if (error.code === 'P2002') {
      // Prisma unique constraint violation
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
