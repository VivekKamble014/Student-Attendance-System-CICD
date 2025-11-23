import { NextRequest, NextResponse } from 'next/server'
import { adminOnly } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

async function handler(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      where: { status: 'PENDING' },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        department: true,
        mobile: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ users })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch pending users', details: error.message },
      { status: 500 }
    )
  }
}

export const GET = adminOnly(handler)

