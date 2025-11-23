import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

// Ensure JWT_SECRET is available - use explicit check for Edge Runtime
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key-change-in-production'

if (!process.env.JWT_SECRET && !process.env.NEXT_PUBLIC_JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET not found in environment variables! Using default (INSECURE)')
}

export interface TokenPayload {
  userId: number
  email: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    if (!token || token.length < 10) {
      console.error('[Auth] Invalid token format, length:', token?.length)
      return null
    }
    
    if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-in-production') {
      console.error('[Auth] JWT_SECRET not properly configured!')
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    console.log('[Auth] Token verified successfully, role:', decoded.role, 'userId:', decoded.userId)
    return decoded
  } catch (error: any) {
    console.error('[Auth] Token verification failed:', error.message)
    console.error('[Auth] JWT_SECRET length:', JWT_SECRET?.length)
    console.error('[Auth] Token preview:', token?.substring(0, 50))
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Also check cookies
  const token = request.cookies.get('token')?.value
  return token || null
}

