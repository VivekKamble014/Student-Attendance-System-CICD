import { NextRequest, NextResponse } from 'next/server'
import { studentOnly } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

// GET - Get student's own attendance
async function getHandler(req: any) {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user!.userId }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const { searchParams } = new URL(req.url!)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = { studentId: student.id }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        teacher: {
          include: {
            user: {
              select: {
                fullName: true
              }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({ attendance })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch attendance', details: error.message },
      { status: 500 }
    )
  }
}

export const GET = studentOnly(getHandler)

