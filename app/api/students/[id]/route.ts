import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, adminOnly, AuthenticatedRequest } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

// GET - Get single student
async function getHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            mobile: true
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json({ student })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch student', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update student
async function putHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    const body = await req.json()
    const { fullName, rollNo, class: className, department, mobile, status } = body

    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Update student and user
    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        rollNo: rollNo || student.rollNo,
        class: className || student.class,
        department: department || student.department,
        status: status || student.status,
        user: {
          update: {
            fullName: fullName || student.user.fullName,
            department: department || student.user.department,
            mobile: mobile !== undefined ? mobile : student.user.mobile
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            mobile: true
          }
        }
      }
    })

    return NextResponse.json({ student: updatedStudent })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update student', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete student
async function deleteHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Delete user (cascade will delete student)
    await prisma.user.delete({
      where: { id: student.userId }
    })

    return NextResponse.json({ message: 'Student deleted successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete student', details: error.message },
      { status: 500 }
    )
  }
}

// Allow admin and teacher
export const GET = requireAuth(getHandler)
export const PUT = requireAuth(putHandler)
export const DELETE = adminOnly(deleteHandler) // Only admin can delete
