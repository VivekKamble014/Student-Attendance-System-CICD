import { NextRequest, NextResponse } from 'next/server'
import { adminOnly, AuthenticatedRequest } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

// PUT - Update department
async function putHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json({ error: 'Department ID is required' }, { status: 400 })
    }

    const { name, code } = await req.json()

    const department = await prisma.department.update({
      where: { id: parseInt(id) },
      data: {
        name: name || undefined,
        code: code || undefined
      }
    })

    return NextResponse.json({ department })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update department', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete department
async function deleteHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json({ error: 'Department ID is required' }, { status: 400 })
    }

    await prisma.department.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Department deleted successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete department', details: error.message },
      { status: 500 }
    )
  }
}

export const PUT = adminOnly(putHandler)
export const DELETE = adminOnly(deleteHandler)

