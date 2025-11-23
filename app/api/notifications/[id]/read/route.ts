import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

// PUT - Mark notification as read
async function putHandler(req: any, { params }: { params: { id: string } }) {
  try {
    const notification = await prisma.notification.update({
      where: { id: parseInt(params.id) },
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

