import { NextRequest, NextResponse } from 'next/server'
import { adminOnly, AuthenticatedRequest } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

// PUT - Update class
async function putHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json({ error: 'Class ID is required' }, { status: 400 })
    }

    const { name, department } = await req.json()

    const classRecord = await prisma.class.update({
      where: { id: parseInt(id) },
      data: {
        name: name || undefined,
        department: department || undefined
      }
    })

    return NextResponse.json({ class: classRecord })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update class', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete class
async function deleteHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json({ error: 'Class ID is required' }, { status: 400 })
    }

    await prisma.class.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Class deleted successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete class', details: error.message },
      { status: 500 }
    )
  }
}

export const PUT = adminOnly(putHandler)
export const DELETE = adminOnly(deleteHandler)

