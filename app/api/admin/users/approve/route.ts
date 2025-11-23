import { NextRequest, NextResponse } from 'next/server'
import { adminOnly } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

async function handler(req: NextRequest) {
  try {
    const { userId, action } = await req.json()

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      )
    }

    const status = action === 'approve' ? 'APPROVED' : 'REJECTED'

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status }
    })

    // Create notification if approved
    if (status === 'APPROVED') {
      await prisma.notification.create({
        data: {
          userId: user.id,
          message: 'Your account has been approved. You can now log in.'
        }
      })
    }

    return NextResponse.json({
      message: `User ${action}d successfully`,
      user
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update user status', details: error.message },
      { status: 500 }
    )
  }
}

export const POST = adminOnly(handler)

