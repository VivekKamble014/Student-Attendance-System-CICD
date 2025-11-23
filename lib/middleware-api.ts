import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenEdge, getTokenFromRequest } from './auth-edge'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: number
    email: string
    role: string
  }
}

export function requireAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const token = getTokenFromRequest(req)
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyTokenEdge(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const authReq = req as AuthenticatedRequest
    authReq.user = payload

    return handler(authReq)
  }
}

export function requireRole(roles: string[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return requireAuth(async (req: AuthenticatedRequest) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return handler(req)
    })
  }
}

export const adminOnly = requireRole(['ADMIN'])
export const teacherOnly = requireRole(['TEACHER', 'ADMIN'])
export const studentOnly = requireRole(['STUDENT'])

