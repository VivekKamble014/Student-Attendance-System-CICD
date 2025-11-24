import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

// PUT - Update attendance
async function putHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json({ error: 'Attendance ID is required' }, { status: 400 })
    }

    const body = await req.json()
    const { status, remarks } = body

    const attendance = await prisma.attendance.findUnique({
      where: { id: parseInt(id) }
    })

    if (!attendance) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 })
    }

    const updated = await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: {
        status: status ? status.toUpperCase() : attendance.status,
        remarks: remarks !== undefined ? remarks : attendance.remarks
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

    return NextResponse.json({ attendance: updated })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update attendance', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete attendance
async function deleteHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json({ error: 'Attendance ID is required' }, { status: 400 })
    }

    const attendance = await prisma.attendance.findUnique({
      where: { id: parseInt(id) }
    })

    if (!attendance) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 })
    }

    await prisma.attendance.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Attendance record deleted successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete attendance', details: error.message },
      { status: 500 }
    )
  }
}

// Allow both admin and teacher
export const PUT = requireAuth(putHandler)
export const DELETE = requireAuth(deleteHandler)

