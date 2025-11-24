import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

// POST - Mark bulk attendance
async function postHandler(req: any) {
  try {
    const body = await req.json()
    const { date, attendanceList } = body

    if (!date || !attendanceList || !Array.isArray(attendanceList)) {
      return NextResponse.json(
        { error: 'Date and attendance list are required' },
        { status: 400 }
      )
    }

    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For admin, use a default teacher or allow admin to mark directly
    // For teacher, use their teacher record
    let teacherId: number | null = null

    if (req.user.role === 'ADMIN') {
      // Admin can mark attendance - find or create a default admin teacher record
      // Or use the first teacher, or allow null teacherId for admin
      const firstTeacher = await prisma.teacher.findFirst()
      if (firstTeacher) {
        teacherId = firstTeacher.id
      } else {
        // If no teacher exists, create a system teacher for admin
        // For now, we'll use null and handle it in the schema if needed
        // Actually, let's require at least one teacher to exist
        return NextResponse.json(
          { error: 'No teacher found. Please create a teacher first.' },
          { status: 400 }
        )
      }
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

    // Create attendance records
    const records = await Promise.all(
      attendanceList.map(async (item: { studentId: number; status: string; remarks?: string }) => {
        // Check if exists
        const existing = await prisma.attendance.findUnique({
          where: {
            studentId_date: {
              studentId: item.studentId,
              date: new Date(date)
            }
          }
        })

        if (existing) {
          // Update existing
          return prisma.attendance.update({
            where: { id: existing.id },
            data: {
              status: item.status.toUpperCase() as 'PRESENT' | 'ABSENT',
              remarks: item.remarks || null
            }
          })
        } else {
          // Create new
          return prisma.attendance.create({
            data: {
              studentId: item.studentId,
              teacherId: teacherId!,
              date: new Date(date),
              status: item.status.toUpperCase() as 'PRESENT' | 'ABSENT',
              remarks: item.remarks || null
            }
          })
        }
      })
    )

    return NextResponse.json({ attendance: records }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to mark bulk attendance', details: error.message },
      { status: 500 }
    )
  }
}

// Allow both admin and teacher
export const POST = requireAuth(postHandler)

