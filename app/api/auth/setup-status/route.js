import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check if any users exist in the database
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      needsSetup: userCount === 0
    });
  } catch (error) {
    console.error('Setup status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
