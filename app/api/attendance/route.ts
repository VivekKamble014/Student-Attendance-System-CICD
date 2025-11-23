import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

// GET - List attendance records
async function getHandler(req: any) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const studentId = searchParams.get('studentId')
    const classFilter = searchParams.get('class')

    const where: any = {}

    if (date) {
      where.date = new Date(date)
    }

    if (studentId) {
      where.studentId = parseInt(studentId)
    }

    if (classFilter) {
      where.student = { class: classFilter }
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true
              }
            }
          }
        },
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

// POST - Mark attendance
async function postHandler(req: any) {
  try {
    const body = await req.json()
    const { studentId, date, status, remarks } = body

    if (!studentId || !date || !status) {
      return NextResponse.json(
        { error: 'Student ID, date, and status are required' },
        { status: 400 }
      )
    }

    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get teacher ID - admin can use first teacher, teacher uses their own
    let teacherId: number

    if (req.user.role === 'ADMIN') {
      const firstTeacher = await prisma.teacher.findFirst()
      if (!firstTeacher) {
        return NextResponse.json(
          { error: 'No teacher found. Please create a teacher first.' },
          { status: 400 }
        )
      }
      teacherId = firstTeacher.id
    } else if (req.user.role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: req.user.userId }
      })
      if (!teacher) {
        return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
      }
      teacherId = teacher.id
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if attendance already exists for this date
    const existing = await prisma.attendance.findUnique({
      where: {
        studentId_date: {
          studentId: parseInt(studentId),
          date: new Date(date)
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Attendance already marked for this date' },
        { status: 400 }
      )
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId: parseInt(studentId),
        teacherId: teacherId,
        date: new Date(date),
        status: status.toUpperCase(),
        remarks: remarks || null
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                fullName: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ attendance }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to mark attendance', details: error.message },
      { status: 500 }
    )
  }
}

// Allow both admin and teacher
export const GET = requireAuth(getHandler)
export const POST = requireAuth(postHandler)

