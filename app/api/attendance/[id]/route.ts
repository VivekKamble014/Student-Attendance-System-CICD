import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

// PUT - Update attendance
async function putHandler(req: any, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { status, remarks } = body

    const attendance = await prisma.attendance.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!attendance) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 })
    }

    const updated = await prisma.attendance.update({
      where: { id: parseInt(params.id) },
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
async function deleteHandler(req: any, { params }: { params: { id: string } }) {
  try {
    const attendance = await prisma.attendance.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!attendance) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 })
    }

    await prisma.attendance.delete({
      where: { id: parseInt(params.id) }
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

