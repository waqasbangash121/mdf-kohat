import { NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/auth'
import { prisma } from '../../../../lib/db'

export async function POST(request) {
  try {
    const { username, email, name } = await request.json()

    // Get auth token from cookies
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    let decoded
    try {
      decoded = verifyToken(token)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Validate input
    if (!username || username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      )
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Check if username or email already exists (excluding current user)
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: decoded.userId } },
          {
            OR: [
              { username },
              { email }
            ]
          }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 400 }
        )
      }
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        username,
        email,
        name: name || null
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true
      }
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
