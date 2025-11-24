import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

// PUT - Mark notification as read
async function putHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 })
    }

    const notification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { read: true }
    })

    return NextResponse.json({ notification })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update notification', details: error.message },
      { status: 500 }
    )
  }
}

export const PUT = requireAuth(putHandler)

