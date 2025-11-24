// Edge Runtime compatible auth functions
import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Convert secret to Uint8Array for jose
const getSecretKey = () => {
  return new TextEncoder().encode(JWT_SECRET)
}

export interface TokenPayload {
  userId: number
  email: string
  role: string
}

export async function generateTokenEdge(payload: TokenPayload): Promise<string> {
  const secretKey = getSecretKey()
  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)
  return token
}

export async function verifyTokenEdge(token: string): Promise<TokenPayload | null> {
  try {
    if (!token || token.length < 10) {
      return null
    }
    
    const secretKey = getSecretKey()
    const { payload } = await jwtVerify(token, secretKey)
    
    return {
      userId: payload.userId as number,
      email: payload.email as string,
      role: payload.role as string
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Auth Edge] Token verification failed:', error.message)
    }
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

