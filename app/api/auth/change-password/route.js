import { NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/auth'
import { prisma } from '../../../../lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { currentPassword, newPassword } = await request.json()

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
    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required' },
        { status: 400 }
      )
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
