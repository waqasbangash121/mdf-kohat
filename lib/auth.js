import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Validate environment variables
if (!JWT_SECRET || JWT_SECRET === 'your_super_secure_jwt_secret_key_here_please_change_this_in_production') {
  console.warn('⚠️  WARNING: Using default JWT_SECRET in production is not secure!');
}

if (!SESSION_SECRET || SESSION_SECRET === 'your_super_secure_session_secret_key_here_please_change_this_too') {
  console.warn('⚠️  WARNING: Using default SESSION_SECRET in production is not secure!');
}

// Hash password
export async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user) {
  return jwt.sign(
    { 
      userId: user.id, 
      username: user.username, 
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Create default admin user if none exists (deprecated - use setup page instead)
export async function createDefaultAdmin() {
  // This function is now deprecated in favor of the setup page
  // Keeping it for backward compatibility but it won't create users automatically
  return null;
}

// Authenticate user
export async function authenticateUser(username, password) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username }
        ],
        isActive: true
      }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return { success: false, error: 'Invalid password' };
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    
    return { 
      success: true, 
      user: userWithoutPassword,
      token: generateToken(userWithoutPassword)
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

// Get user by token
export async function getUserByToken(token) {
  try {
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        isActive: true
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    return user;
  } catch (error) {
    console.error('Error getting user by token:', error);
    return null;
  }
}
