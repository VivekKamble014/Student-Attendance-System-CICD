import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, adminOnly, AuthenticatedRequest } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

// GET - Get single teacher
async function getHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 })
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            mobile: true,
            status: true,
            department: true
          }
        }
      }
    })

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    return NextResponse.json({ teacher })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch teacher', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update teacher
async function putHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 })
    }

    const body = await req.json()
    const { fullName, department, mobile, password, status } = body

    const teacher = await prisma.teacher.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    })

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    const updateData: any = {}
    if (fullName) updateData.fullName = fullName
    if (department) updateData.department = department
    if (mobile !== undefined) updateData.mobile = mobile
    if (status) updateData.status = status
    if (password) {
      updateData.password = await hashPassword(password)
    }

    // Update user
    await prisma.user.update({
      where: { id: teacher.userId },
      data: updateData
    })

    // Update teacher department if changed
    if (department && department !== teacher.department) {
      await prisma.teacher.update({
        where: { id: teacher.id },
        data: { department }
      })
    }

    const updated = await prisma.teacher.findUnique({
      where: { id: teacher.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            mobile: true,
            status: true,
            department: true
          }
        }
      }
    })

    return NextResponse.json({ teacher: updated })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update teacher', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete teacher
async function deleteHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 })
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: parseInt(id) }
    })

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    // Delete teacher (user will be cascade deleted)
    await prisma.teacher.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Teacher deleted successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete teacher', details: error.message },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(getHandler)
export const PUT = adminOnly(putHandler)
export const DELETE = adminOnly(deleteHandler)
