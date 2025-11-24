import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

async function handler(req: any) {
  try {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = req.user
    let stats: any = {}

    if (user.role === 'ADMIN') {
      const [totalStudents, totalTeachers, pendingUsers, totalAttendance] = await Promise.all([
        prisma.student.count(),
        prisma.teacher.count(),
        prisma.user.count({ where: { status: 'PENDING' } }),
        prisma.attendance.count()
      ])

      stats = {
        totalStudents,
        totalTeachers,
        pendingUsers,
        totalAttendance
      }
    } else if (user.role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: user.userId }
      })

      if (!teacher) {
        return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay()) // Start of week (Sunday)

      const [myAttendance, todayAttendance, weekAttendance, recentAttendance] = await Promise.all([
        prisma.attendance.count({
          where: { teacherId: teacher.id }
        }),
        prisma.attendance.count({
          where: {
            teacherId: teacher.id,
            date: {
              gte: today
            }
          }
        }),
        prisma.attendance.count({
          where: {
            teacherId: teacher.id,
            date: {
              gte: weekStart
            }
          }
        }),
        prisma.attendance.findMany({
          where: { teacherId: teacher.id },
          take: 5,
          orderBy: { date: 'desc' },
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
      ])

      stats = {
        myAttendance,
        todayAttendance,
        weekAttendance,
        recentAttendance
      }
    } else if (user.role === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { userId: user.userId }
      })

      if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 })
      }

      const [totalRecords, presentRecords, recentAttendance] = await Promise.all([
        prisma.attendance.count({
          where: { studentId: student.id }
        }),
        prisma.attendance.count({
          where: {
            studentId: student.id,
            status: 'PRESENT'
          }
        }),
        prisma.attendance.findMany({
          where: { studentId: student.id },
          take: 5,
          orderBy: { date: 'desc' },
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
          }
        })
      ])

      const attendancePercentage = totalRecords > 0 
        ? ((presentRecords / totalRecords) * 100).toFixed(2)
        : '0'

      stats = {
        attendancePercentage: parseFloat(attendancePercentage),
        totalRecords,
        presentRecords,
        recentAttendance
      }
    }

    return NextResponse.json({ stats })
  } catch (error: any) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats', details: error.message },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(handler)

